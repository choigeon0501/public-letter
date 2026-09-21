'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = { videoId: string; title: string };

/**
 * 클릭 전에는 썸네일만 보여주고, 누르면 그때 유튜브 iframe을 넣는다.
 * 유튜브 스크립트를 페이지 로드 시점에 받지 않아 가볍고, 쿠키 없는 도메인을 쓴다.
 */
export default function YouTubeEmbed({ videoId, title }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink shadow-[0_18px_40px_-20px_rgba(30,42,58,0.5)]">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`${title} 영상 재생`}
        >
          <Image
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-ink/20 transition-colors group-hover:bg-ink/10" aria-hidden />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-stamp text-white shadow-lg" aria-hidden>
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
