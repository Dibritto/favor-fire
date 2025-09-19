
"use client";

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const slides = [
  {
    imageSrc: 'https://picsum.photos/seed/slide1/1920/1080',
    imageAlt: 'Pessoas colaborando em um projeto comunitário',
    title: 'Conecte-se, Compartilhe e Ajude',
    description: 'Sua comunidade a um favor de distância. Peça ajuda, ofereça suas habilidades e construa laços mais fortes.',
    aiHint: 'community people working',
  },
  {
    imageSrc: 'https://picsum.photos/seed/slide2/1920/1080',
    imageAlt: 'Uma pessoa ajudando outra a carregar caixas',
    title: 'A Ajuda Certa na Hora Certa',
    description: 'De pequenas tarefas a grandes projetos, encontre vizinhos dispostos a colaborar e fazer a diferença.',
    aiHint: 'people helping move',
  },
  {
    imageSrc: 'https://picsum.photos/seed/slide3/1920/1080',
    imageAlt: 'Um grupo de pessoas sorrindo e interagindo',
    title: 'Fortaleça Sua Vizinhança',
    description: 'Junte-se a uma rede de confiança e solidariedade. Cada favor fortalece os laços da sua comunidade.',
    aiHint: 'diverse group smiling',
  },
];

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect) };
  }, [emblaApi]);

  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div className="relative flex-[0_0_100%] h-full" key={index}>
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                className="object-cover"
                priority={index === 0}
                data-ai-hint={slide.aiHint}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="mt-4 text-lg md:text-xl text-gray-200">
                    {slide.description}
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild size="lg">
                      <Link href="/auth/cadastrar">
                        Comece Agora <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary">
                      <Link href="#recursos">Saiba Mais</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 hover:text-white"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/50 hover:text-white"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              selectedIndex === index ? "w-4 bg-white" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </section>
  );
}
