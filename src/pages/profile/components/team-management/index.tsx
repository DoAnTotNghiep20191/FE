import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import BankDetails from '../bank-details';
import 'src/components/Table/styles.scss';
import { Grid, Select, Table, TableColumnsType } from 'antd';
import {
  BackIcon,
  DropDownIcon,
  ExportIcon,
  InviteIcon,
  MinusCircle,
  RemoveMemberIcon,
} from 'src/assets/icons';
import './styles.scss';
import CustomSearch from 'src/components/Search';
import ModalTeamManagement from '../modal-team-management';
import NotificationModal from 'src/pages/event-detail/components/NotificationModal';
import ModalComponent from 'src/components/Modals';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getAccessToken, getUserInfo } from 'src/store/selectors/user';
import {
  useChangeRoleTeamMutation,
  useGetBankQuery,
  useGetMemberByTeamQuery,
  useRemoveMemberMutation,
} from 'src/store/slices/profile/api';
import { ETeamRole, TeamNamRole } from 'src/store/slices/user/types';
import { ToastMessage } from 'src/components/Toast';
import { debounce } from 'lodash';
import { DATE_FORMAT } from 'src/constants';
import { C1001, C1075, MSG } from 'src/constants/errorCode';
import { formatDate } from 'src/helpers/formatValue';
import dayjs from 'dayjs';
import BackMobileIcon from 'src/assets/icons/common/arrow-left.svg?react';
import { useTranslation } from 'react-i18next';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
import { setIsCreateTeam } from 'src/store/slices/auth';
import ModalLinkShopify from '../link-shopify';
import { useGetUserInfoQuery } from 'src/store/slices/user/api';

const { useBreakpoint } = Grid;

interface DataType {
  key: number;
  name: string;
  access?: ETeamRole;
  mobile?: string;
  email?: string;
}

const renderOptionLabel = (option: any) => (
  <div className="">
    <span>{option.label}</span>
  </div>
);

const TeamManagement = () => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const [openBankDetails, setOpenBankDetails] = useState(false);
  const [openLinkShopify, setOpenLinkShopify] = useState(false);
  const { Option } = Select;
  const { rudderAnalytics } = useRudderStack();
  const dispatch = useAppDispatch();

  const [isInviteMember, setInviteMember] = useState(false);
  const [isInviteSent, setInviteSent] = useState(false);
  const [dataRemove, setDataRemove] = useState<{ id: number; name: string } | null>(null);
  const [isRemoveSuccess, setRemoveSuccess] = useState(false);
  const [isConfirmRemove, setIsConfirmRemove] = useState(false);
  const [dataTable, setDataTable] = useState<DataType[] | any>([]);
  const [searchVal, setSearchVal] = useState('');
  const [valueDebounce, setValueDebounce] = useState('');

  useGetUserInfoQuery(undefined, { refetchOnMountOrArgChange: true });

  const userInfo = useAppSelector(getUserInfo);
  const accessToken = useAppSelector(getAccessToken);

  const { data: bankDetail, refetch } = useGetBankQuery(undefined);
  const [changeRoleTeam] = useChangeRoleTeamMutation();
  const [removeMember] = useRemoveMemberMutation();

  const { data: dataTeam } = useGetMemberByTeamQuery(
    {
      sortBy: 'createdAt',
      direction: 'DESC',
      teamId: userInfo?.currentTeamId!,
      search: valueDebounce.trim(),
    },
    {
      skip: !userInfo?.currentTeamId,
    },
  );

  useEffect(() => {
    const newArray = dataTeam?.data?.map((item: any) => ({
      key: item?.id,
      name: item?.user?.username,
      access: item?.role,
      mobile: item?.user?.phone,
      email: item?.user?.email,
    }));
    setDataTable(newArray);
  }, [dataTeam]);

  const accessTeam = [
    {
      label: 'Admin',
      value: ETeamRole?.ADMIN,
    },
    {
      label: t('team.organizer'),
      value: ETeamRole?.ORGANIZER,
    },
    {
      label: t('team.operations'),
      value: ETeamRole?.OPERATIONS,
    },
  ];

  const onSelectAccess = async (data: { id: number; role: ETeamRole }) => {
    try {
      const payload = {
        idTeam: userInfo?.currentTeamId!,
        memberId: data?.id,
        role: data?.role,
      };
      await changeRoleTeam(payload).unwrap();
      ToastMessage.success(t(MSG[C1075], { role: TeamNamRole[data?.role] }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 2 || !value) {
      setValueDebounce(value);
    }
  };

  const debounceHandler = useCallback(debounce(handleSearchChange, 500), []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    debounceHandler(e);
  };

  const handleClickRemove = (key: number, name: string) => {
    setDataRemove({ id: key, name: name });
    setIsConfirmRemove(true);
  };

  const handleSendInviteSuccess = async () => {
    setInviteMember(false);
    setInviteSent(true);
  };

  const handleConfirmRemove = async () => {
    try {
      await removeMember({ idTeam: userInfo?.currentTeamId!, memberId: dataRemove?.id! }).unwrap();
      setIsConfirmRemove(false);
      setRemoveSuccess(true);
    } catch (err: any) {
      console.error(err);
      ToastMessage.error(t(MSG[err?.data?.validator_errors || C1001]));
    }
  };

  const handleExportCSV = async () => {
    if (dataTable.length === 0) return;
    try {
      const url = `${
        import.meta.env.VITE_BASE_URL
      }/team/${userInfo?.currentTeamId}/members/export-excel?search=${valueDebounce?.trim()}`;
      const headers = new Headers({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      });

      const options = {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ search: valueDebounce }),
      };

      const response = await fetch(url, options);
      const blob = await response.blob();
      const link = document.createElement('a');
      const fileURL = window.URL.createObjectURL(blob);
      const currentDate = formatDate(dayjs(), DATE_FORMAT);
      link.href = fileURL;
      link.download = `Member_Team_${currentDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      rudderAnalytics?.track(ERudderStackEvents.TeamExported, {
        eventType: ERudderStackEvents.TeamExported,
        data: {
          ...(valueDebounce && { search: valueDebounce }),
          teamId: userInfo?.currentTeamId,
        },
      });
    } catch (error: any) {
      console.error(error);
      ToastMessage.error(MSG[error?.data?.validator_errors || C1001]);
    }
  };

  const renderSelectAccess = (item: any, access: ETeamRole) => {
    if (userInfo?.roleOfTeam === ETeamRole.ADMIN) {
      if (access === ETeamRole.ADMIN) {
        return <p className="capitalize text-base">{t('team.admin')}</p>;
      } else {
        return (
          <Select
            // style={{ width: 120, color: '#fff' }}
            value={access}
            onChange={(value) => onSelectAccess({ id: item.key!, role: value })}
            // className="custom-select"
            className="w-[120px] custom-select "
            rootClassName="border-none"
            // dropdownStyle={dropdownStyle}
            suffixIcon={<DropDownIcon />}
          >
            {accessTeam.map((access) => (
              <Option
                key={access.value}
                value={access.value}
                label={renderOptionLabel(access)}
                // style={optionStyle}
              >
                <p className="capitalize text-base">{access.label}</p>
              </Option>
            ))}
          </Select>
        );
      }
    }
    if (userInfo?.roleOfTeam === ETeamRole.ORGANIZER) {
      if (access === ETeamRole.ADMIN) {
        return <p className="capitalize ">{t('team.admin')}</p>;
      }
      if (access === ETeamRole.ORGANIZER) {
        return <p className="capitalize ">{t('team.organizer')}</p>;
      } else {
        return (
          <Select
            // style={{ width: 120, color: '#fff' }}
            value={access}
            onChange={(value) => onSelectAccess({ id: item.key!, role: value })}
            // className="custom-select"
            className="w-[120px]"
            // dropdownStyle={dropdownStyle}
            suffixIcon={<DropDownIcon />}
          >
            {accessTeam.map((access) => (
              <Option
                key={access.value}
                value={access.value}
                label={renderOptionLabel(access)}
                // style={optionStyle}
              >
                {access.label}
              </Option>
            ))}
          </Select>
        );
      }
    }

    if (userInfo?.roleOfTeam === ETeamRole.OPERATIONS) {
      if (access === ETeamRole.ADMIN) {
        return <p className="capitalize ">{t('team.admin')}</p>;
      }
      if (access === ETeamRole.ORGANIZER) {
        return <p className="capitalize ">{t('team.organizer')}</p>;
      }

      return <p className="capitalize">{t('team.operations')}</p>;
    }
  };

  const handleRemoveSuccess = () => {
    setRemoveSuccess(false);
    setDataRemove(null);
  };

  const columns: TableColumnsType<DataType> = [
    {
      dataIndex: '',
      key: 'action',
      render: ({ access, key, name }) => {
        if (
          userInfo?.roleOfTeam === ETeamRole.ADMIN &&
          (access === ETeamRole.OPERATIONS || access === ETeamRole.ORGANIZER)
        ) {
          return (
            <div
              className="flex text-red cursor-pointer"
              onClick={() => handleClickRemove(key, name)}
            >
              <MinusCircle className="" />
            </div>
          );
        }
        if (userInfo?.roleOfTeam === ETeamRole.ORGANIZER && access === ETeamRole.OPERATIONS) {
          return (
            <div
              className="flex text-red cursor-pointer"
              onClick={() => handleClickRemove(key, name)}
            >
              <MinusCircle className="" />
            </div>
          );
        }
        if (userInfo?.roleOfTeam === ETeamRole.OPERATIONS) {
          return null;
        }
      },
      width: 28,
    },
    {
      title: t('team.name'),
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: t('team.mobile'),
      dataIndex: 'mobile',
      key: 'mobile',
      width: 200,
    },
    {
      title: t('team.email'),
      dataIndex: 'email',
      key: 'email',
      width: 300,
    },
    {
      title: t('team.access'),
      dataIndex: 'access',
      key: 'access',
      render: (access, item) => {
        return renderSelectAccess(item, access);
      },
      width: 150,
    },
  ];

  const mobileColumns: TableColumnsType<DataType> = [
    {
      title: t('team.memberDetails'),
      render: (_, record) => {
        let actionCmp;
        if (
          userInfo?.roleOfTeam === ETeamRole.ADMIN &&
          (record.access === ETeamRole.OPERATIONS || record.access === ETeamRole.ORGANIZER)
        ) {
          actionCmp = (
            <div
              className="flex text-red cursor-pointer"
              onClick={() => handleClickRemove(record.key, record.name)}
            >
              <MinusCircle className="w-[14px] h-[14px]" />
            </div>
          );
        }
        if (
          userInfo?.roleOfTeam === ETeamRole.ORGANIZER &&
          record.access === ETeamRole.OPERATIONS
        ) {
          actionCmp = (
            <div
              className="flex text-red cursor-pointer"
              onClick={() => handleClickRemove(record.key, record.name)}
            >
              <MinusCircle className="w-[14px] h-[14px]" />
            </div>
          );
        }
        if (userInfo?.roleOfTeam === ETeamRole.OPERATIONS) {
          actionCmp = null;
        }
        return (
          <>
            <div className="my-1 flex flex-col">
              <span className="flex items-center gap-[4px]">
                {actionCmp && actionCmp}
                <span className="text-[14px] block max-w-[140px] md:max-w-none truncate mr-1">
                  {record.name}
                </span>
              </span>
              <span className="text-xs text-gray">{record.mobile}</span>
              <span className="text-xs text-gray">{record.email}</span>
            </div>
          </>
        );
      },
    },
    {
      title: t('team.access'),
      dataIndex: 'access',
      key: 'access',
      render: (access, item) => {
        return renderSelectAccess(item, access);
      },
      width: 120,
    },
  ];

  const nameTeam = useMemo(() => {
    if (!userInfo?.currentTeamId) return;
    const teamFind = userInfo?.teams?.find((i) => i?.teamId === userInfo?.currentTeamId);
    return teamFind?.team?.name;
  }, [userInfo?.teams, userInfo?.currentTeamId]);

  const locale = {
    emptyText: <p className="py-[20px]">{t('common.noResults')}</p>,
  };

  const handleOpenTeam = () => {
    dispatch(setIsCreateTeam(true));
  };

  const handleOpenLinkShopify = () => {
    setOpenLinkShopify(true);
  };

  return (
    <>
      <div className="custom-table md:px-[24px] md:py-[20px] mx-5 md:mx-0 min-h-[700px] mb-[40px]">
        <section className="mb-[24px] flex md:justify-between max-md:flex-col max-md:items-center max-md:mt-[16px] gap-[16px]">
          <p className="text-2xl font-[500] font-loos">{nameTeam}</p>
          <div className="flex gap-[10px]">
            {userInfo?.roleOfTeam === ETeamRole.ADMIN && (
              <ButtonContained
                mode="medium"
                buttonType="type2"
                className="w-44 bg-[#fff] border-none shadow-lg"
                onClick={() => setOpenBankDetails(true)}
              >
                {t('team.bankDetails')}
              </ButtonContained>
            )}

            <ButtonContained
              mode="medium"
              buttonType="type2"
              className="w-44 bg-[#fff] border-none shadow-lg"
              onClick={handleOpenLinkShopify}
            >
              {t('campaigns:linkShopify')}
            </ButtonContained>
            <ButtonContained
              mode="medium"
              buttonType="type2"
              className="w-44 bg-[#fff] border-none shadow-lg"
              onClick={handleOpenTeam}
            >
              {t('createTeam.switchTeam')}
            </ButtonContained>
          </div>
        </section>
        <div className="bg-[#F2F2F5] p-[20px] rounded-[3px] shadow-xl border-l-4 border-solid border-[#FFDB00]">
          <div>
            <div className="flex justify-between items-center mb-[8px]">
              <p className="flex cursor-pointer" onClick={handleExportCSV}>
                <span className="text-[12px] mr-[4px] text-primary">{t('team.exportToCSV')}</span>
                <ExportIcon />
              </p>
              <div>
                {(userInfo?.roleOfTeam === ETeamRole.ADMIN ||
                  userInfo?.roleOfTeam === ETeamRole.ORGANIZER) && (
                  <InviteIcon className="cursor-pointer" onClick={() => setInviteMember(true)} />
                )}
              </div>
            </div>
            <CustomSearch
              onChange={handleSearch}
              value={searchVal}
              type="type2"
              placeholder={t('team.searchTeam')}
              className="max-md:w-full mb-[8px]"
            />
          </div>
          <Table
            locale={locale}
            columns={breakpoint.lg ? columns : mobileColumns}
            dataSource={dataTable}
            pagination={false}
            scroll={{ x: '100%' }}
            className="customize-table"
          />
        </div>
      </div>

      <ModalLinkShopify
        isOpen={openLinkShopify}
        onClose={() => {
          setOpenLinkShopify(false);
          refetch();
        }}
      />
      <BankDetails
        isOpen={openBankDetails}
        defaultStep={bankDetail?.data?.isBankDetail ? 0 : 1}
        onclose={() => {
          setOpenBankDetails(false);
          refetch();
        }}
        bankDetail={bankDetail?.data?.isBankDetail ? bankDetail?.data : null}
        teamId={userInfo?.currentTeamId!}
      />
      <ModalTeamManagement
        isOpen={isInviteMember}
        onClose={() => setInviteMember(false)}
        onSendInviteSuccess={handleSendInviteSuccess}
        teamId={userInfo?.currentTeamId!}
      />
      <NotificationModal
        isOpen={isInviteSent}
        title={t('team.inviteSent')}
        description={t('team.weSentSentAnInvite')}
        textButton={t('team.buttonClose')}
        onButton={() => setInviteSent(false)}
        onClose={() => setInviteSent(false)}
      />

      <ModalComponent
        open={isConfirmRemove}
        centered
        width={'684px'}
        onCancel={() => setIsConfirmRemove(false)}
        className="relative"
      >
        <button onClick={() => setIsConfirmRemove(false)} className="btn back">
          <BackIcon />
        </button>
        {!breakpoint?.md && (
          <BackMobileIcon className="absolute top-11 left-5" onClick={() => setDataRemove(null)} />
        )}
        <div className="flex flex-col items-center justify-start md:justify-start  m-auto mt-[20px] pb-[20px] md:h-auto">
          <p className="text-center text-[24px] font-normal font-loos">
            {t('team.removingTeamMember')}
          </p>
          <p className="text-[14px] text-center mb-10">
            {t('team.areYouSureYouWould', { memberName: dataRemove?.name })}
          </p>
          <RemoveMemberIcon className="mt-[56px] mb-[262.86px]" />
          <ButtonContained
            buttonType="type2"
            className="mt-auto md:mt-0 max-w-[180px] !text-[#E53535] !border-[#E53535]"
            fullWidth
            onClick={handleConfirmRemove}
          >
            {t('team.yesConfirmRemoval')}
          </ButtonContained>
        </div>
      </ModalComponent>
      <NotificationModal
        isOpen={isRemoveSuccess}
        title={t('team.teamMemberRemoved')}
        description={t('team.youHaveRemoved', { name: dataRemove?.name })}
        textButton="Close"
        onButton={handleRemoveSuccess}
        onClose={handleRemoveSuccess}
      />
    </>
  );
};

export default TeamManagement;
