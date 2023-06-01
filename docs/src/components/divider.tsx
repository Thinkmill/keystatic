import { cx } from '../utils';

export default function Divider({
  className = '',
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      role="separator"
      className={cx('h-[7px] w-[100px]', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 100 7"
      aria-hidden="true"
    >
      <path
        fill="#000"
        stroke="#000"
        d="M.549 1.803v.001c-.059.2-.037.434.16.745.207.326.59.707 1.203 1.146.187.135.567.293 1.094.454.51.155 1.103.296 1.672.417a39.225 39.225 0 0 0 2.1.381l.017.003.052.002.232.008a609.223 609.223 0 0 0 3.779.123c2.329.07 5.22.145 7.478.166 2.443.023 4.68-.029 6.77-.078l.29-.006c2.169-.05 4.184-.094 6.091-.037.814.018 3.297.055 5.529.062h.223c2.207.008 5.071.017 6.47.039 2.596.032 5.585.055 10.844.097l4.203.034c9.04.062 12.237.09 15.095.113l.583.005h.002c1.086.015 2.8.026 4.384.035l1.883.013c3.408.018 5.373.03 12.982.103 1.346.008 2.366 0 3.11-.027.761-.028 1.179-.075 1.36-.128l.207-.061c.337-.098.678-.198.947-.342.158-.085.236-.158.269-.207.017-.026.029-.049.009-.116-.085-.293-.106-.308-.115-.315l-.002-.001c-.039-.032-.163-.096-.664-.192H98.8c-.54-.111-1.318-.105-2.272-.067l-.569.024c-.782.034-1.633.07-2.461.052-1.61-.037-3.638-.082-4.495-.1h-.005c-2.987-.094-15.863-.386-23.934-.552-2.01-.035-3.923-.084-6.614-.155L57.22 3.41h-.003c-.905-.029-2.65-.056-4.05-.078l-.332-.006c-1.2-.019-2.63-.057-3.51-.08l-.468-.012h-.011c-.743-.037-2.51-.07-3.957-.093-.856-.013-1.894-.036-2.784-.055-.602-.013-1.137-.024-1.503-.03l-.009-.001a317.11 317.11 0 0 0-3.036-.075c-.901-.02-1.883-.043-2.813-.066-.81-.02-1.658-.04-2.455-.057-1.454-.034-2.737-.063-3.298-.085l-.552-.012a483.142 483.142 0 0 0-3.934-.07c-1.612-.02-3.314-.072-3.785-.098-.45-.024-2.135-.076-3.742-.095a128.37 128.37 0 0 1-3.785-.098c-.462-.025-1.551-.089-2.409-.14a11.894 11.894 0 0 1-1.09-.114c-.241-.033-.465-.065-.781-.088a70.13 70.13 0 0 1-2.92-.306 151.303 151.303 0 0 1-1.54-.195l-.095-.013-.025-.003h-.006l-.031-.004-.124-.012a17.955 17.955 0 0 0-1.821-.069c-.51.011-.995.055-1.358.148-.182.047-.306.1-.382.15a.238.238 0 0 0-.061.05Zm-.001.001a.007.007 0 0 0-.001.002l.001-.002Z"
      />
    </svg>
  );
}
