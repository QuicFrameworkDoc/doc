import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '轻量化开发',
    Svg: require('@site/static/img/program.svg').default,
    description: (
      <>
        QuicFrameWork专注于提供http/https服务,对外API简洁,只需简单了解即可构建出完整
        的web应用服务
      </>
    ),
  },
  {
    title: '更快的速度',
    Svg: require('@site/static/img/faster.svg').default,
    description: (
      <>
        QuicFrameWork默认使用基于UDP的quic协议进行网络连接,天然比基于TCP的http1-2速度快很多，
        并且框架本身对路由查找进行索引优化，尽可能提高传输速率
      </>
    ),
  },
  {
    title: '专注HTTP服务',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
       QuicFrameWork专注于为开发者提供最舒适的http开发体验，使您用最简单的代码实现最高自由度
       的开发
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
