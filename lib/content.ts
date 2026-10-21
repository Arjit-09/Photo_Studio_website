export const chapters = [
  { number: '01', label: 'The moment', heading: 'It begins with you.', description: 'An unguarded glance. A hand reaching for another. The kind of moment you wish would last.' },
  { number: '02', label: 'The capture', heading: 'A feeling. A fraction of a second.', description: 'We follow the light, find the feeling, and let life happen. Then, at just the right moment…' },
  { number: '03', label: 'The memory', heading: 'A little piece of forever.', description: 'What was a fleeting second becomes something you can hold. A moment, beautifully kept.' },
  { number: '04', label: 'The story', heading: 'Your story, frame by frame.', description: 'Not just photographs. A collection of everything it felt like to be there. Yours to return to.' },
];
export const projects = [
  { id: 'golden', title: 'Where the light finds us', names: 'Maya & Oliver', category: 'Weddings', location: 'Tuscany, Italy', image: '/images/couple.jpg', alt: 'Newlyweds sharing a kiss in the warm evening light', year: '2026' },
  { id: 'always', title: 'The beginning of always', names: 'Amelia & James', category: 'Weddings', location: 'Provence, France', image: '/images/wedding.jpg', alt: 'A joyful wedding celebration with a bride and groom', year: '2026' },
  { id: 'together', title: 'Nowhere else but here', names: 'Sofia & Daniel', category: 'Couples', location: 'Cotswolds, England', image: '/images/embrace.jpg', alt: 'A couple holding hands as they walk through sunlit hills', year: '2025' },
  { id: 'quiet', title: 'In her own light', names: 'The portrait series', category: 'Portraits', location: 'London, England', image: '/images/portrait.jpg', alt: 'A naturally lit editorial portrait outdoors', year: '2026' },
];
export type Project = typeof projects[number];
export const studio = { name: 'Frame by Frame', tagline: 'Honest moments. Artfully kept.', email: 'sharmaarjit813@gmail.com' };

export const films = [
  { title: 'The way it felt', subtitle: 'LOVE, IN THE LITTLE MOMENTS', src: '/videos/couple.mp4', poster: '/images/couple-poster.jpg', credit: 'https://www.pexels.com/video/3015510/' },
  { title: 'Somewhere, together', subtitle: 'A GOLDEN-HOUR ESCAPE', src: '/videos/meadow.mp4', poster: '/images/meadow-poster.jpg', credit: 'https://www.pexels.com/video/4189165/' },
  { title: 'An ocean of always', subtitle: 'A CELEBRATION BY THE SEA', src: '/videos/coast.mp4', poster: '/images/coast-poster.jpg', credit: 'https://www.pexels.com/video/11037944/' },
];
