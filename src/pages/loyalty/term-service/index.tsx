import clsx from 'classnames';
import './style.scss';
import { Trans, useTranslation } from 'react-i18next';
interface ITermsData {
  title: string;
  children?: Array<string | ITermsData>;
  note?: string;
}

const TermOfService = () => {
  const terms: ITermsData[] = [
    {
      title: 'terms.about-mereo',
      children: [
        {
          title: 'terms.about-mereo.content1',
        },
        {
          title: 'terms.about-mereo.content2',
          children: [
            'terms.about-mereo.subcontent1',
            'terms.about-mereo.subcontent2',
            'terms.about-mereo.subcontent3',
          ],
        },
        {
          title: 'terms.about-mereo.content3',
        },
        {
          title: 'terms.about-mereo.content4',
        },
      ],
    },
    {
      title: 'terms.mereo-nfts',
      children: [
        {
          title: 'terms.mereo-nfts.content1',
          children: ['terms.mereo-nft.subcontent1', 'terms.mereo-nft.subcontent2'],
        },
      ],
    },
    {
      title: 'terms.introduction',
      children: [
        {
          title: 'terms.introduction.content1',
        },
        {
          title: 'terms.introduction.content2',
          children: [
            'terms.introduction.subcontent1',
            'terms.introduction.subcontent2',
            { title: '', note: 'terms.introduction.note1' },
          ],
        },
        {
          title: 'terms.introduction.content3',
        },
        {
          title: 'terms.introduction.content4',
        },
        {
          title: 'terms.introduction.content5',
        },
        {
          title: 'terms.introduction.content6',
        },
        {
          title: 'terms.introduction.content7',
        },
        {
          title: 'terms.introduction.content8',
        },
        {
          title: 'terms.introduction.content9',
        },
        {
          title: 'terms.introduction.content10',
        },
        {
          title: 'terms.introduction.content11',
        },
      ],
    },
    {
      title: 'terms.general-representations',
      children: [
        {
          title: 'terms.general-representations.content1',
          children: [
            'terms.general-representations.subcontent1',
            'terms.general-representations.subcontent2',
            'terms.general-representations.subcontent3',
            'terms.general-representations.subcontent4',
            'terms.general-representations.subcontent5',
            'terms.general-representations.subcontent6',
          ],
        },
        {
          title: 'terms.general-representations.content2',
        },
        {
          title: 'terms.general-representations.content3',
        },
      ],
    },
    {
      title: 'terms.warning-and-risk',
      note: 'terms.warning-and-risk.note',
      children: [
        {
          title: 'terms.warning-and-risk.content1',
          children: ['terms.warning-and-risk.subcontent1'],
        },
        {
          title: 'terms.warning-and-risk.content2',
        },
        {
          title: 'terms.warning-and-risk.content3',
        },
        {
          title: 'terms.warning-and-risk.content4',
        },
        {
          title: 'terms.warning-and-risk.content5',
        },
        {
          title: 'terms.warning-and-risk.content6',
        },
      ],
    },
    {
      title: 'terms.risks',
      children: [
        {
          title: 'terms.risks.content1',
          children: [
            'terms.risks.subcontent1',
            'terms.risks.subcontent2',
            'terms.risks.subcontent3',
            'terms.risks.subcontent4',
            'terms.risks.subcontent5',
            'terms.risks.subcontent6',
            'terms.risks.subcontent7',
            'terms.risks.subcontent8',
            'terms.risks.subcontent9',
            'terms.risks.subcontent10',
          ],
        },
      ],
    },
    {
      title: 'terms.general-terms',
      children: [
        {
          title: 'terms.general-terms.content1',
          children: [
            'terms.general-terms.subcontent1',
            'terms.general-terms.subcontent2',
            'terms.general-terms.subcontent3',
            'terms.general-terms.subcontent4',
          ],
        },
        {
          title: 'terms.general-terms.content2',
          children: [
            {
              title: 'terms.general-terms.content2.subcontent1',
            },
            {
              title: 'terms.general-terms.content2.subcontent2',
              children: [
                'terms.general-terms.content2.subcontent2.children1',
                'terms.general-terms.content2.subcontent2.children2',
                'terms.general-terms.content2.subcontent2.children3',
                'terms.general-terms.content2.subcontent2.children4',
                'terms.general-terms.content2.subcontent2.children5',
                'terms.general-terms.content2.subcontent2.children6',
              ],
            },
            {
              title: 'terms.general-terms.content2.subcontent3',
            },
          ],
        },
        {
          title: 'terms.general-terms.content3',
          children: ['terms.general-terms.content3.subcontent1'],
        },
        {
          title: 'terms.general-terms.content4',
          children: [
            {
              title: 'terms.general-terms.content4.subcontent1',
              children: [
                'terms.general-terms.content4.subcontent1.children1',
                'terms.general-terms.content4.subcontent1.children2',
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'terms.content',
      children: [
        {
          title: 'terms.content.content1',
          children: [
            'terms.content.content1.subcontent1',
            'terms.content.content1.subcontent2',
            'terms.content.content1.subcontent3',
            'terms.content.content1.subcontent4',
            'terms.content.content1.subcontent5',
          ],
        },
        {
          title: 'terms.content.content2',
          children: ['terms.content.content2.subcontent1', 'terms.content.content2.subcontent2'],
        },
      ],
    },
    {
      title: 'terms.intellectual-property',
      children: [
        'terms.intellectual-property.content1',
        'terms.intellectual-property.content2',
        'terms.intellectual-property.content3',
      ],
    },
    {
      title: 'terms.unacceptable',
      children: [
        {
          title: 'terms.unacceptable.content1',
          children: [
            'terms.unacceptable.subcontent1',
            'terms.unacceptable.subcontent2',
            'terms.unacceptable.subcontent3',
            'terms.unacceptable.subcontent4',
            'terms.unacceptable.subcontent5',
            'terms.unacceptable.subcontent6',
            'terms.unacceptable.subcontent7',
            'terms.unacceptable.subcontent8',
            'terms.unacceptable.subcontent9',
            'terms.unacceptable.subcontent10',
            'terms.unacceptable.subcontent11',
            {
              title: 'terms.unacceptable.subcontent12',
              children: [
                'terms.unacceptable.subcontent12.children1',
                'terms.unacceptable.subcontent12.children2',
                'terms.unacceptable.subcontent12.children3',
                'terms.unacceptable.subcontent12.children4',
                'terms.unacceptable.subcontent12.children5',
              ],
            },
            'terms.unacceptable.subcontent13',
            'terms.unacceptable.subcontent14',
            'terms.unacceptable.subcontent15',
            'terms.unacceptable.subcontent16',
            'terms.unacceptable.subcontent17',
            'terms.unacceptable.subcontent18',
            'terms.unacceptable.subcontent19',
          ],
        },
        {
          title: 'terms.unacceptable.content2',
        },
      ],
    },
    {
      title: 'terms.warranties',
      children: [
        'terms.warranties.content1',
        {
          title: 'terms.warranties.content2',
          children: [
            'terms.warranties.subcontent1',
            'terms.warranties.subcontent2',
            'terms.warranties.subcontent3',
          ],
        },
        'terms.warranties.content3',
        'terms.warranties.content4',
        'terms.warranties.content5',
        'terms.warranties.content6',
        'terms.warranties.content7',
        {
          title: 'terms.warranties.content8',
          children: [
            'terms.warranties.content8.subcontent1',
            'terms.warranties.content8.subcontent2',
            'terms.warranties.content8.subcontent3',
            'terms.warranties.content8.subcontent4',
            'terms.warranties.content8.subcontent5',
            'terms.warranties.content8.subcontent6',
            'terms.warranties.content8.subcontent7',
            'terms.warranties.content8.subcontent8',
            'terms.warranties.content8.subcontent9',
            'terms.warranties.content8.subcontent10',
          ],
        },
        'terms.warranties.content9',
        'terms.warranties.content10',
        'terms.warranties.content11',
        'terms.warranties.content12',
        'terms.warranties.content13',
        {
          title: 'terms.warranties.content14',
          children: [
            'terms.warranties.content14.subcontent1',
            'terms.warranties.content14.subcontent2',
          ],
        },
        'terms.warranties.content15',
        {
          title: 'terms.warranties.content16',
          children: [
            'terms.warranties.content16.subcontent1',
            {
              title: 'terms.warranties.content16.subcontent2',
              children: [
                'terms.warranties.content16.subcontent2.children1',
                'terms.warranties.content16.subcontent2.children2',
                'terms.warranties.content16.subcontent2.children3',
                'terms.warranties.content16.subcontent2.children4',
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'terms.reserved-rights',
      children: ['terms.reserved-rights.content1'],
    },
    {
      title: 'terms.taxation',
      children: [
        'terms.taxation.content1',
        {
          title: 'terms.taxation.content2',
          children: ['terms.taxation.content2.subcontent1'],
        },
        'terms.taxation.content3',
      ],
    },
    {
      title: 'terms.dispute-governing-law',
      children: ['terms.dispute-governing-law.content1', 'terms.dispute-governing-law.content2'],
    },
    {
      title: 'terms.arbitration',
      children: [
        {
          title: 'terms.arbitration.content1',
          children: ['terms.arbitration.subcontent1', 'terms.arbitration.subcontent2'],
        },
        {
          title: 'terms.arbitration.content2',
          children: ['terms.arbitration.content2.subcontent1'],
        },
        {
          title: 'terms.arbitration.content3',
          children: ['terms.arbitration.content3.subcontent1'],
        },
        {
          title: 'terms.arbitration.content4',
          children: [
            {
              title: 'terms.arbitration.content4.subcontent1',
              children: [
                'terms.arbitration.content4.subcontent1.children1',
                'terms.arbitration.content4.subcontent1.children2',
              ],
            },
          ],
        },
        {
          title: 'terms.arbitration.content5',
          children: [
            'terms.arbitration.content5.subcontent1',
            'terms.arbitration.content5.subcontent2',
          ],
        },
        {
          title: 'terms.arbitration.content6',
          children: [
            'terms.arbitration.content6.subcontent1',
            'terms.arbitration.content6.subcontent2',
          ],
        },
        {
          title: 'terms.arbitration.content7',
          children: ['terms.arbitration.content7.subcontent1'],
        },
        'terms.arbitration.content8',
        {
          title: 'terms.arbitration.content9',
          children: ['terms.arbitration.content9.subcontent1'],
        },
        {
          title: 'terms.arbitration.content10',
          children: ['terms.arbitration.content10.subcontent1'],
        },
      ],
    },
    {
      title: 'terms.leaderboards',
      children: ['terms.leaderboards.content1', 'terms.leaderboards.content2'],
    },
    {
      title: 'terms.priority',
      children: ['terms.priority.content1'],
    },
    {
      title: 'terms.interpreted',
      children: ['terms.interpreted.content1'],
    },
    {
      title: 'terms.severability',
      children: ['terms.severability.content1'],
    },
  ];

  const { t } = useTranslation();

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
        <span className={clsx('block', isSubTitle ? 'font-normal' : 'font-bold')}>
          {<Trans Trans components={{ bold: <strong /> }} i18nKey={item.title} />}
        </span>
        <span key={item.note}>{<Trans i18nKey={item.note} />}</span>
        {item.children && (
          <ol>
            {Array.isArray(item.children) &&
              item.children.map((child) => {
                if (typeof child === 'string') {
                  return (
                    <li key={child}>
                      <span className="font-extralight italic">
                        {
                          <Trans
                            Trans
                            components={{ bold: <strong className="font-bold" /> }}
                            i18nKey={child}
                          />
                        }
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
    <div className="text-black1 w-full mx:w-[974px] mx-auto mt-12 px-5 md:px-0">
      <p className="text-2xl text-center font-loos">{t('terms.title')}</p>
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

export default TermOfService;
