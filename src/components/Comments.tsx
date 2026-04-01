"use client";

import Giscus from "@giscus/react";

interface CommentsProps {
  term: string;
}

export default function Comments({ term }: CommentsProps) {
  return (
    <div className="mt-8">
      <Giscus
        repo="babjul314/issueglobe.com"
        repoId="R_kgDOR3G2gA"
        category="General"
        categoryId="DIC_kwDOR3G2gM4C50bn"
        mapping="specific"
        term={term}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
