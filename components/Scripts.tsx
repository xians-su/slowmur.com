import Script from 'next/script';
import BLOG from '~/blog.config';
import CJK from '~/lib/cjk';

export const Scripts: React.FC = () => (
  <>
    {BLOG.analytics && BLOG.analytics.provider === 'ackee' && (
      <Script
        src={BLOG.analytics.ackeeConfig.tracker}
        data-ackee-server={BLOG.analytics.ackeeConfig.dataAckeeServer}
        data-ackee-domain-id={BLOG.analytics.ackeeConfig.domainId}
      />
    )}
    {BLOG.analytics && BLOG.analytics.provider === 'ga' && (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${BLOG.analytics.gaConfig.measurementId}`} />
      </>
    )}
    <noscript>
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=Noto+${
          BLOG.font === 'serif' ? 'Serif' : 'Sans'
        }+${CJK()}:wght@400;700&display=swap`}
      />
    </noscript>
  </>
);
