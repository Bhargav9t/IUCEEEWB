export interface EspartoImageItem {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
}

export const ESPARTO_IMAGES: EspartoImageItem[] = Array.from({ length: 76 }, (_, i) => {
  const num = String(i + 1).padStart(2, "0");
  return {
    id: `esparto-${num}`,
    image: `/images/events/esparto-hhc/esparto-${num}.jpg`,
    title: `Esparto • Moment ${i + 1}`
  };
});
