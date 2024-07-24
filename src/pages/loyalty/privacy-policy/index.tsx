import clsx from 'classnames';
import './style.scss';
import { Trans, useTranslation } from 'react-i18next';
interface ITermsData {
  title: string;
  children?: Array<string | ITermsData>;
  note?: string;
}

const PrivacyPolicy = () => {
  const [t] = useTranslation();

  const terms: ITermsData[] = [
    {
      title: 'policy.1',
      children: [
        {
          title: 'policy.1.1',
        },
        {
          title: 'policy.1.2',
        },
        {
          title: 'policy.1.3',
        },
        {
          title: 'policy.1.4',
        },
        {
          title: 'policy.1.5',
        },
        {
          title: 'policy.1.6',
        },
      ],
    },
    {
      title: 'policy.2',
      children: [
        {
          title: 'policy.2.1',
        },
        {
          title: 'policy.2.2',
        },
        {
          title: 'policy.2.3',
          children: [
            {
              title: 'policy.2.3.1',
            },
            {
              title: 'policy.2.3.2',
            },
          ],
        },
      ],
    },
    {
      title: 'policy.3',
      children: [
        {
          title: 'policy.3.1',
          children: [
            {
              title: 'policy.3.1.1',
            },
            {
              title: 'policy.3.1.2',
            },
            {
              title: 'policy.3.1.3',
            },
            {
              title: 'policy.3.1.4',
            },
            {
              title: 'policy.3.1.5',
            },
            {
              title: 'policy.3.1.6',
            },
            {
              title: 'policy.3.1.7',
            },
          ],
        },
      ],
    },
    {
      title: 'policy.4',
      children: [
        {
          title: 'policy.4.1',
        },
        {
          title: 'policy.4.2',
        },
        {
          title: 'policy.4.3',
        },
        {
          title: 'policy.4.4',
        },
        {
          title: 'policy.4.5',
        },
        {
          title: 'policy.4.6',
        },
        {
          title: 'policy.4.7',
        },
        {
          title: 'policy.4.8',
        },
        {
          title: 'policy.4.9',
        },
        {
          title: 'policy.4.10',
        },
      ],
    },
    {
      title: 'policy.5',
      children: [
        {
          title: 'policy.5.1',
          children: [
            {
              title: 'policy.5.1.1',
            },
            {
              title: 'policy.5.1.2',
            },
            {
              title: 'policy.5.1.3',
            },
            {
              title: 'policy.5.1.4',
            },
            {
              title: 'policy.5.1.5',
            },
            {
              title: 'policy.5.1.6',
            },
            {
              title: 'policy.5.1.7',
            },
            {
              title: 'policy.5.1.8',
            },
            {
              title: 'policy.5.1.9',
            },
            {
              title: 'policy.5.1.10',
            },
          ],
        },
      ],
    },
    {
      title: 'policy.6',
      children: [
        {
          title: 'policy.6.1',
        },
        {
          title: 'policy.6.2',
        },
        {
          title: 'policy.6.3',
        },
        {
          title: 'policy.6.4',
        },
        {
          title: 'policy.6.5',
        },
        {
          title: 'policy.6.6',
          children: [
            {
              title: 'policy.6.6.1',
            },
          ],
        },
        {
          title: 'policy.6.7',
          children: [
            {
              title: 'policy.6.7.1',
            },
          ],
        },
        {
          title: 'policy.6.8',
          children: [
            {
              title: 'policy.6.8.1',
            },
          ],
        },
        {
          title: 'policy.6.9',
          children: [
            {
              title: 'policy.6.9.1',
            },
          ],
        },
        {
          title: 'policy.6.10',
        },
        {
          title: 'policy.6.11',
        },
      ],
    },
    {
      title: 'policy.7',
      children: [
        {
          title: 'policy.7.1',
        },
      ],
    },
    {
      title: 'policy.8',
      children: [
        {
          title: 'policy.8.1',
        },
        {
          title: 'policy.8.2',
        },
        {
          title: 'policy.8.3',
        },
        {
          title: 'policy.8.4',
        },
        {
          title: 'policy.8.5',
        },
        {
          title: 'policy.8.6',
        },
        {
          title: 'policy.8.7',
        },
        {
          title: 'policy.8.8',
        },
        {
          title: 'policy.8.9',
        },
      ],
    },
    {
      title: 'policy.9',
      children: [
        {
          title: 'policy.9.1',
        },
      ],
    },
    {
      title: 'policy.10',
      children: [
        {
          title: 'policy.10.1',
          children: [
            {
              title: 'policy.10.1.1',
            },
          ],
        },
        {
          title: 'policy.10.2',
          children: [
            {
              title: 'policy.10.2.1',
            },
          ],
        },
        {
          title: 'policy.10.3',
          children: [
            {
              title: 'policy.10.3.1',
            },
          ],
        },
        {
          title: 'policy.10.4',
          children: [
            {
              title: 'policy.10.4.1',
            },
          ],
        },
      ],
    },
    {
      title: 'policy.11',
      children: [
        {
          title: 'policy.11.1',
        },
        {
          title: 'policy.11.2',
        },
        {
          title: 'policy.11.3',
        },
        {
          title: 'policy.11.4',
        },
        {
          title: 'policy.11.5',
        },
        {
          title: 'policy.11.6',
        },
      ],
    },
    {
      title: 'policy.12',
      children: [
        {
          title: 'policy.12.1',
        },
      ],
    },
    {
      title: 'policy.13',
      children: [
        {
          title: 'policy.13.1',
        },
        {
          title: 'policy.13.2',
        },
        {
          title: 'policy.13.3',
          children: [
            {
              title: 'policy.13.3.1',
            },
            {
              title: 'policy.13.3.2',
            },
            {
              title: 'policy.13.3.3',
            },
            {
              title: 'policy.13.3.4',
            },
          ],
        },
        {
          title: 'policy.13.4',
          children: [
            {
              title: 'policy.13.4.1',
            },
          ],
        },
      ],
    },
    {
      title: 'policy.14',
      children: [
        {
          title: 'policy.14.1',
        },
        {
          title: 'policy.14.2',
        },
        {
          title: 'policy.14.3',
        },
        {
          title: 'policy.14.4',
        },
        {
          title: 'policy.14.5',
        },
        {
          title: 'policy.14.6',
        },
        {
          title: 'policy.14.7',
          children: [
            {
              title: 'policy.14.7.1',
              children: [
                {
                  title: 'policy.14.7.1.1',
                },
              ],
            },
            {
              title: 'policy.14.7.2',
            },
            {
              title: 'policy.14.7.3',
            },
            {
              title: 'policy.14.7.4',
            },
          ],
        },
        {
          title: 'policy.14.8',
          children: [
            {
              title: 'policy.14.8.1',
            },
          ],
        },
        {
          title: 'policy.14.9',
          children: [
            {
              title: 'policy.14.9.1',
            },
          ],
        },
        {
          title: 'policy.14.10',
          children: [
            {
              title: 'policy.14.10.1',
              children: [
                {
                  title: 'policy.14.10.1.1',
                },
                {
                  title: 'policy.14.10.1.2',
                },
                {
                  title: 'policy.14.10.1.3',
                },
                {
                  title: 'policy.14.10.1.4',
                },
                {
                  title: 'policy.14.10.1.5',
                },
              ],
            },
            {
              title: 'policy.14.10.2',
            },
          ],
        },
        {
          title: 'policy.14.11',
        },
        {
          title: 'policy.14.12',
          children: [
            {
              title: 'policy.14.12.1',
            },
          ],
        },
        {
          title: 'policy.14.13',
          children: [
            {
              title: 'policy.14.13.1',
            },
          ],
        },
        {
          title: 'policy.14.14',
          children: [
            {
              title: 'policy.14.14.1',
              children: [
                {
                  title: 'policy.14.14.1.1',
                },
                {
                  title: 'policy.14.14.1.2',
                },
                {
                  title: 'policy.14.14.1.3',
                },
                {
                  title: 'policy.14.14.1.4',
                },
                {
                  title: 'policy.14.14.1.5',
                },
                {
                  title: 'policy.14.14.1.6',
                },
              ],
            },
          ],
        },
        {
          title: 'policy.14.15',
          children: [
            {
              title: 'policy.14.15.1',
              children: [
                {
                  title: 'policy.14.15.1.1',
                },
                {
                  title: 'policy.14.15.1.2',
                },
                {
                  title: 'policy.14.15.1.3',
                },
                {
                  title: 'policy.14.15.1.4',
                },
                {
                  title: 'policy.14.15.1.5',
                },
                {
                  title: 'policy.14.15.1.6',
                },
                {
                  title: 'policy.14.15.1.7',
                },
                {
                  title: 'policy.14.15.1.8',
                },
                {
                  title: 'policy.14.15.1.9',
                },
              ],
            },
          ],
        },
        {
          title: 'policy.14.16',
          children: [
            {
              title: 'policy.14.16.1',
              children: [
                {
                  title: 'policy.14.16.1.1',
                },
                {
                  title: 'policy.14.16.1.2',
                },
                {
                  title: 'policy.14.16.1.3',
                },
                {
                  title: 'policy.14.16.1.4',
                },
                {
                  title: 'policy.14.16.1.5',
                },
              ],
            },
          ],
        },
        {
          title: 'policy.14.17',
        },
        {
          title: 'policy.14.18',
        },
        {
          title: 'policy.14.19',
          children: [
            {
              title: 'policy.14.19.1',
            },
            {
              title: 'policy.14.19.2',
            },
          ],
        },
        {
          title: 'policy.14.20',
        },
        {
          title: 'policy.14.21',
          children: [
            {
              title: 'policy.14.21.1',
            },
          ],
        },
        {
          title: 'policy.14.22',
          children: [
            {
              title: 'policy.14.22.1',
            },
          ],
        },
        {
          title: 'policy.14.23',
          children: [
            {
              title: 'policy.14.23.1',
            },
          ],
        },
        {
          title: 'policy.14.24',
          children: [
            {
              title: 'policy.14.24.1',
            },
          ],
        },
      ],
    },
    {
      title: 'policy.15',
      children: [
        {
          title: 'policy.15.1',
        },
      ],
    },
  ];

  const NestedList: React.FC<{ item: ITermsData | string; isSubTitle?: boolean }> = ({
    item,
    isSubTitle,
  }) => {
    if (typeof item === 'string') {
      return (
        <li>
          <span>{<Trans components={{ bold: <strong /> }} i18nKey={item} />}</span>
        </li>
      );
    }

    return (
      <li className={isSubTitle ? 'sub-title' : 'title'}>
        <span className={clsx('my-10', isSubTitle ? 'font-normal' : 'font-bold')}>
          {<Trans Trans components={{ bold: <strong /> }} i18nKey={item.title} />}
        </span>
        {item.children && (
          <ol>
            {Array.isArray(item.children) &&
              item.children.map((child) => {
                if (typeof child === 'string') {
                  return (
                    <li key={child}>
                      <span className="font-extralight italic">
                        {<Trans Trans components={{ bold: <strong /> }} i18nKey={child} />}
                      </span>
                    </li>
                  );
                }
                if (!child.note) {
                  return <NestedList isSubTitle key={child.title} item={child} />;
                } else {
                  return <span key={child.note}>{<Trans i18nKey={child.note} />}</span>;
                }
              })}
          </ol>
        )}
      </li>
    );
  };

  return (
    <div className="privacy-policy w-full mx:w-[974px] mx-auto mt-12 pb-[32px] px-5 md:px-0">
      <p className="text-2xl text-center font-loos">{t('policy.title')}</p>
      <ol>
        {terms.map((term) => {
          return (
            <li key={term.title} className=" text-base my-10 md:px-5">
              <NestedList item={term} />
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default PrivacyPolicy;
