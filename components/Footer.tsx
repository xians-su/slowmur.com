//import classNames from 'classnames';
//import BLOG from '~/blog.config';
//import Vercel from '~/components/Vercel';

//type Props = { fullWidth?: boolean };

//export const Footer: React.VFC<Props> = ({ fullWidth }) => {
//  const d = new Date();
//  const y = d.getFullYear();
//  const from = +BLOG.since;
//  return (
//    <div
//      className={classNames('mt-6 flex-shrink-0 m-auto w-full text-gray-500 dark:text-gray-400 transition-all', {
//        'px-4 md:px-24': fullWidth,
//        'max-w-2xl px-4': !fullWidth,
//      })}
//    >
//      <hr className="border-gray-200 dark:border-gray-600" />
//      <div className="my-4 text-sm leading-6">
//        <div className="flex flex-wrap justify-between align-baseline">
//          <p>
//            © {BLOG.author} {from === y || !from ? y : `${from} - ${y}`}
//         </p>{' '}
//                      <a href="https://vercel.com">
//						Powered by
//						<svg
//							width="21"
//							height="27"
//							viewBox="4 2 21 27"
//							fill="none"
//							xmlns="http://www.w3.org/2000/svg"
//							className="inline-block"
//						>
//							<g clipPath="url(#clip0)">
//								<path d="M14.8431 8.27271L20.7772 18.4545H8.90918L14.8431 8.27271Z" fill="black" />
//							</g>
//						</svg>Vercel
//					</a>
//					{/* <Vercel /> */}
//       </div>
//      </div>
//    </div>
//  );
//};
