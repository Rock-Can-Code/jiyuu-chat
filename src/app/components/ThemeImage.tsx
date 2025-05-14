import Image, { ImageProps } from "next/image";

export type ThemeImageProps = Omit<ImageProps, "src" | "priority" | "loading"> & {
  srcLight: ImageProps["src"];
  srcDark: ImageProps["src"];
};

export const ThemeImage = ({
  srcLight,
  srcDark,
  alt,
  className,
  ...rest
}: ThemeImageProps) => {
  return (
    <>
      <img
        src={srcLight as string}
        alt={alt}
        className={`dark:hidden ${className || ""}`}
        {...rest}
      />
      <img
        src={srcDark as string}
        alt={alt}
        className={`hidden dark:block ${className || ""}`}
        {...rest}
      />
    </>
  );
};
