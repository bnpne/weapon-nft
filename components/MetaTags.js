import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// Hello

const MetaTags = ({ title = "Weapon NFT", description = "Create NFT" }) => {
  const router = useRouter();
  const image = "https://nft.bnpne.co/rect.png";

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <meta content={description} name="description" />
      <meta
        property="og:url"
        content={`https://nft.bnpne.co${router.asPath}`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Ben Paine" />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@bnpneth" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

export default MetaTags;
