import Head from "next/head";
import PropTypes from "prop-types";
import type { FC } from "react";

interface SeoProps {
  title?: string;
}

export const Seo: FC<SeoProps> = (props) => {
  const { title } = props;

  const fullTitle = title
    ? title + " | Московское долголетие"
    : "Московское долголетие";

  return (
    <Head>
      <title>{fullTitle}</title>
    </Head>
  );
};

Seo.propTypes = {
  title: PropTypes.string,
};
