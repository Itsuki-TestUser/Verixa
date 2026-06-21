// src/components/SEO.jsx
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Verixa AI - Intelligent AI Knowledge Assistant",
  description = "Verixa AI helps you search, analyze, and understand documents using advanced AI. Built for enterprises and modern teams.",
  url = "https://verixa.ai",
  image = "https://verixa.ai/og-image.png",
}) => {
  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
