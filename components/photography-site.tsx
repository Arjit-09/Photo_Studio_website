'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue, useReducedMotion, AnimatePresence, MotionConfig } from 'motion/react';
import { ArrowUpRight, ArrowDown, ArrowLeft, ArrowRight, Play, Pause, X, Menu, Plus, Aperture, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { chapters, projects, films, studio, type Project } from '@/lib/content';

const ease = [0.22, 1, 0.36, 1] as const;
function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.9, ease }}>{children}</motion.div>;
}
function Brand({ dark = false }: { dark?: boolean }) {
  return <a className={`brand ${dark ? 'brand-dark' : ''}`} href="#home" aria-label="Frame by Frame home"><span className="brand-mark"><Aperture strokeWidth={1.25} size={22}/></span><span>frame <i>by</i> frame<small>PHOTOGRAPHY & FILMS</small></span></a>;
}

export default function PhotographySite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState('All stories');
  const [selected, setSelected] = useState<Project | null>(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryText, setInquiryText] = useState('');
  const [activeFilm, setActiveFilm] = useState(0);
  const [filmOpen, setFilmOpen] = useState(false);
  const [albumPage, setAlbumPage] = useState(0);
  const filmDialog = useRef<HTMLDialogElement>(null);
  const imageDialog = useRef<HTMLDialogElement>(null);
  const inquiryDialog = useRef<HTMLDialogElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (reduced) setPaused(true);
  }, [reduced]);
  function openInquiry() { setInquirySent(false); inquiryDialog.current?.showModal(); setMenuOpen(false); }
  function openFilm(index = 0) { setActiveFilm(index); setFilmOpen(true); filmDialog.current?.showModal(); }
  useEffect(() => { document.body.classList.toggle('motion-paused', paused || !!reduced); return () => document.body.classList.remove('motion-paused'); }, [paused, reduced]);
  useEffect(() => { const closeMenu = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); }; window.addEventListener('keydown', closeMenu); return () => window.removeEventListener('keydown', closeMenu); }, []);
  function closeFilm() { filmRef.current?.pause(); filmDialog.current?.close(); setFilmOpen(false); }
  function openImage(project: Project) { setSelected(project); imageDialog.current?.showModal(); }
  function stepImage(direction: number) {
    const index = projects.findIndex(p => p.id === selected?.id);
    setSelected(projects[(index + direction + projects.length) % projects.length]);
  }
  function submitInquiry(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = new FormData(e.currentTarget);
    const name = String(form.get('name')).trim();
    const message = e.currentTarget.elements.namedItem('message') as HTMLTextAreaElement;
    if (message.value.trim().length < 10) { message.setCustomValidity('Please share at least 10 characters about your plans.'); message.reportValidity(); return; }
    setInquiryName(name.split(' ')[0]);
    setInquiryText(`Hello Frame by Frame,\n\nI'd love to discuss a ${form.get('session')}.\n\nName: ${name}\nEmail: ${form.get('email')}\nDate: ${form.get('date') || 'To be decided'}\n\n${String(form.get('message')).trim()}\n\nSent from the Frame by Frame website.`); setInquirySent(true);
  }
  return <MotionConfig reducedMotion={paused || reduced ? "always" : "user"}>
    <a className="skip-link" href="#work">Skip to selected work</a>
    <header className={`header ${scrolled || menuOpen ? 'header-solid' : ''}`}>
      <Brand />
      <nav aria-label="Main navigation" className={menuOpen ? 'nav nav-open' : 'nav'}>
        {['Our story', 'Selected work', 'Films', 'The experience'].map((label, index) => <a key={label} href={['#story', '#work', '#films', '#experience'][index]} onClick={() => setMenuOpen(false)}>{label}</a>)}
        <button className="nav-inquire" onClick={openInquiry}>Let’s make memories <ArrowUpRight size={16}/></button>
      </nav>
      <button className="menu-toggle icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>
    <main>
      <ScrollStory paused={paused || !!reduced || filmOpen} onPause={() => setPaused(!paused)} onFilm={() => openFilm(0)} albumPage={albumPage} setAlbumPage={setAlbumPage}/>
      <section id="story" className="intro section-pad">
        <Reveal className="intro-top"><p className="eyebrow"><span className="little-star">✳</span> THE ART OF REMEMBERING</p><p className="small-note">For the wildly in love.<br/>And the beautifully ordinary.</p></Reveal>
        <Reveal><h2>Life moves fast.<br/>Let’s make something <em>last.</em></h2></Reveal>
        <Reveal className="intro-bottom"><span className="handwritten">This is what forever feels like.</span><div><p>We believe the best photographs don’t just show you how it looked. They bring you back to how it felt. The nervous laughter. The quiet closeness. The wonderfully unplanned.</p><a className="text-link" href="#experience">A little more about our approach <ArrowUpRight size={17}/></a></div></Reveal>
      </section>
      <MemoryRibbon paused={paused || !!reduced}/>
      <section className="portfolio section-pad" id="work">
        <Reveal className="section-heading"><div><p className="eyebrow">A FEW STORIES, BEAUTIFULLY KEPT</p><h2>Love, in all its <em>frames.</em></h2></div><span className="index-mark">SELECTED WORK / 2025—26</span></Reveal>
        <div className="filter-row" aria-label="Filter photography stories">{['All stories', 'Weddings', 'Couples', 'Portraits'].map(item => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}{item === 'All stories' && <sup>04</sup>}</button>)}<span className="filter-caption">Every story is a world of its own.</span></div>
        <motion.div layout className="project-grid"><AnimatePresence mode="popLayout">{projects.filter(p => filter === 'All stories' || p.category === filter).map((project, index) => <motion.article layout className={`project project-${index % 2}`} key={project.id} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: reduced ? 0 : 0.5, ease }}>
          <button className="project-image" onClick={() => openImage(project)} aria-label={`View ${project.title}`}><img src={project.image} alt={project.alt} loading="lazy" width="1000" height="1200"/><span className="project-category">{project.category}</span><span className="project-open"><ArrowUpRight size={24}/></span><span className="project-hover">STEP INSIDE THEIR STORY</span></button>
          <div className="project-caption"><div><p>{project.names} <span>— {project.location}</span></p><h3><button onClick={() => openImage(project)}>{project.title}</button></h3></div><span className="project-year">{project.year}</span></div>
        </motion.article>)}</AnimatePresence></motion.div>
        <p className="demo-note">An illustrative collection. Names and locations are sample stories; imagery is stock photography.</p>
      </section>
      <section className="film-section" id="films" aria-label="Our photography films">
        <AmbientVideo paused={paused || filmOpen} className="film-background" src="/videos/coast.mp4" poster="/images/coast-poster.jpg"/>
        <div className="film-shade"/>
        <Reveal className="film-copy"><p className="eyebrow">SOME THINGS ARE BETTER FELT</p><h2>More than a photograph.<br/><em>A feeling, on repeat.</em></h2><button className="film-play" onClick={() => openFilm(0)}><span><Play size={18} fill="currentColor"/></span>PLAY THE STUDIO FILM <small>A WEDDING IN MOTION</small></button></Reveal>
        <button className="film-pause icon-button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play background video' : 'Pause background video'}>{paused ? <Play size={18}/> : <Pause size={18}/>}</button>
      </section>
      <section className="film-library section-pad" aria-label="Film collection">
        <Reveal className="film-library-heading"><p className="eyebrow">THE MOTION COLLECTION</p><p>Three little escapes. <em>A thousand ways to feel.</em></p></Reveal>
        <div className="film-grid">{films.map((film, index) => <Reveal key={film.src}><button className="film-card" onClick={() => openFilm(index)} aria-label={`Watch ${film.title}`}><img src={film.poster} alt="" loading="lazy" width="640" height="400"/><span className="film-card-play"><Play size={20}/></span><span className="film-card-number">0{index + 1} / FILM</span><span className="film-card-title">{film.title}<small>{film.subtitle} <ArrowUpRight size={16}/></small></span></button></Reveal>)}</div>
        <p className="demo-note">A curated stock-film collection, shared as visual inspiration.</p>
      </section>
      <section className="experience section-pad" id="experience">
        <Reveal className="experience-image"><img src="/images/photographer.jpg" alt="A photographer with a camera in a sunlit woodland" loading="lazy" width="800" height="1000"/><div className="image-sticker"><Aperture size={23} strokeWidth={1}/><span>A little soul.<br/>In every frame.</span></div><span className="vertical-caption">THE PEOPLE BEHIND THE PICTURES</span></Reveal>
        <div className="experience-copy"><Reveal><p className="eyebrow">LESS POSING. MORE LIVING.</p><h2>You be you.<br/>We’ll catch<br/><em>the magic.</em></h2><p>Think of us as a calm presence with a camera. We make space for you to feel at ease, follow your own rhythm, and forget the lens is even there.</p><p>From that first hello to the final page of your album, we make the experience feel as personal as the photographs.</p></Reveal>
          <div className="process-list">{[{ title: 'First, we connect', text: 'A relaxed conversation about your people, your plans, and the things you never want to forget.' }, { title: 'Then, you live the moment', text: 'Gentle direction when you need it. Space to be yourselves when you don’t. We’ll take care of the light.' }, { title: 'Finally, you relive it', text: 'A thoughtfully edited gallery and a beautifully designed heirloom album, made to be revisited.' }].map((item, i) => <details key={item.title}><summary><span className="process-number">0{i + 1}</span>{item.title}<Plus size={17}/></summary><p>{item.text}</p></details>)}</div>
          <button className="text-link" onClick={openInquiry}>Tell us your story <ArrowUpRight size={17}/></button>
        </div>
      </section>
      <section className="questions section-pad" aria-labelledby="questions-heading"><Reveal><p className="eyebrow">BEFORE THE FIRST FRAME</p><h2 id="questions-heading">A little clarity.<br/><em>A lot to look forward to.</em></h2></Reveal><div className="process-list">{[
        ['How do we start?', 'Tell us about the occasion, your location, and any date you have in mind. The inquiry builder prepares an email to the studio so we can discuss availability and the right approach.'],
        ['What should we include in our inquiry?', 'Your preferred date, location, the type of session, and a little about the people involved. It’s completely fine if your plans are still taking shape.'],
        ['Can we share a moodboard?', 'Absolutely. Attach your references when you send the prepared email. Tell us what draws you to them: the light, the colours, or simply the feeling.'],
        ['Does an inquiry confirm a booking?', 'An inquiry starts a conversation. Availability, pricing, deliverables, and booking terms are agreed directly with the studio before a booking is confirmed.'],
      ].map(([title, body], index) => <details key={title}><summary><span className="process-number">0{index + 1}</span>{title}<Plus size={17}/></summary><p>{body}</p></details>)}</div></section>
      <section className="contact section-pad" id="contact"><AmbientVideo paused={paused || filmOpen} className="contact-background" src="/videos/meadow.mp4" poster="/images/meadow-poster.jpg"/><div className="contact-overlay"/><Reveal><p className="eyebrow">EVERY GREAT STORY STARTS WITH A HELLO</p><h2>Let’s make<br/><em>something timeless.</em></h2><p>Your people. Your love. Your beautifully imperfect story.<br/>We’d be honoured to help you remember it.</p><button className="pill-button" onClick={openInquiry}>Let’s tell your story <ArrowUpRight size={20}/></button><a className="contact-email" href={`mailto:${studio.email}`}>{studio.email}</a><span className="contact-note">WEDDINGS · COUPLES · PORTRAITS</span></Reveal><span className="contact-doodle" aria-hidden="true">f / f</span></section>
    </main>
    <footer className="footer"><div className="footer-top"><Brand dark/><p>Honest moments. Artfully kept.</p><a className="text-link" href="#home">Back to the beginning <ArrowUpRight size={15}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Frame by Frame</span><span>AN INDEPENDENT PHOTOGRAPHY STUDIO · DEMO</span><a href="/privacy/">Privacy</a><a href="/credits/">Image & film credits <ArrowUpRight size={12}/></a></div></footer>
    <button className="global-motion" onClick={() => setPaused(!paused)} aria-pressed={paused || !!reduced} aria-label={paused ? 'Resume background motion' : 'Pause background motion'}>{paused || reduced ? <Play size={13}/> : <Pause size={13}/>}<span>{paused || reduced ? 'Motion paused' : 'Pause motion'}</span></button>
    <dialog ref={filmDialog} className="modal film-modal" aria-label="Studio film" onClose={() => { filmRef.current?.pause(); setFilmOpen(false); }} onClick={e => { if (e.target === e.currentTarget) closeFilm(); }}><button className="modal-close icon-button" onClick={closeFilm} aria-label="Close film"><X/></button>{filmOpen && <video key={activeFilm} ref={filmRef} src={films[activeFilm].src} controls autoPlay playsInline preload="none" poster={films[activeFilm].poster}/>}<p>{films[activeFilm].title} — stock film inspiration. <a href={films[activeFilm].credit} target="_blank" rel="noreferrer">Film credit ↗</a></p></dialog>
    <dialog ref={imageDialog} className="modal image-modal" aria-label="Photography viewer" onClick={e => { if (e.target === e.currentTarget) imageDialog.current?.close(); }} onKeyDown={e => { if (e.key === 'ArrowRight') stepImage(1); if (e.key === 'ArrowLeft') stepImage(-1); }}><button className="modal-close icon-button" onClick={() => imageDialog.current?.close()} aria-label="Close photograph"><X/></button>{selected && <><img src={selected.image} alt={selected.alt}/><div className="lightbox-bottom"><button className="icon-button" onClick={() => stepImage(-1)} aria-label="Previous photograph"><ArrowLeft/></button><div><h3>{selected.title}</h3><p>{selected.names} · {selected.location} · Illustrative story</p></div><button className="icon-button" onClick={() => stepImage(1)} aria-label="Next photograph"><ArrowRight/></button></div></>}</dialog>
    <dialog ref={inquiryDialog} className="modal inquiry-modal" aria-label="Tell us your story" onClick={e => { if (e.target === e.currentTarget) inquiryDialog.current?.close(); }}><button className="modal-close icon-button" onClick={() => inquiryDialog.current?.close()} aria-label="Close inquiry"><X/></button>{inquirySent ? <div className="inquiry-success" role="status"><span className="success-icon"><Check/></span><p className="eyebrow">A BEAUTIFUL BEGINNING</p><h2>Lovely to meet you,<br/><em>{inquiryName}.</em></h2><p>Your inquiry is ready. Open it in your email app, review it, and press send. Nothing has been sent yet.</p><a className="pill-button" href={`mailto:${studio.email}?subject=${encodeURIComponent('Photography inquiry — ' + inquiryName)}&body=${encodeURIComponent(inquiryText)}`}>Open email & review <ArrowUpRight size={18}/></a><a className="download-inquiry" href={`data:text/plain;charset=utf-8,${encodeURIComponent(inquiryText)}`} download="frame-by-frame-inquiry.txt">Download a copy</a><p className="inquiry-recipient">To: {studio.email}</p><button className="text-link" onClick={() => setInquirySent(false)}>Edit your details</button></div> : <><p className="eyebrow">LET’S GET TO KNOW YOU</p><h2>Tell us <em>your story.</em></h2><p className="form-intro">A few little details to start something wonderful.</p><form onSubmit={submitInquiry}><div className="form-row"><label>Your name<input name="name" placeholder="Your full name" required pattern=".*[^ ].*[^ ].*" minLength={2} maxLength={100} autoComplete="name"/></label><label>Email address<input name="email" type="email" placeholder="you@example.com" required autoComplete="email"/></label></div><div className="form-row"><label>What are we celebrating?<select name="session" defaultValue="Wedding"><option>Wedding</option><option>Couples session</option><option>Portrait session</option><option>Something else</option></select></label><label>Your date (if you know it)<input name="date" type="date"/></label></div><label>A little about your plans<textarea name="message" onInput={e => e.currentTarget.setCustomValidity('')} rows={3} placeholder="The place, the people, the feeling…" required minLength={10} maxLength={1200}/></label><p className="form-disclaimer">We’ll prepare an email to sharmaarjit813@gmail.com. Your details stay in this page until you choose to send them in your email app.</p><button className="pill-button" type="submit">Prepare your inquiry <ArrowUpRight size={18}/></button></form></>}</dialog>
  </MotionConfig>;
}

function AmbientVideo({ paused, className, src = '/videos/couple.mp4', poster = '/images/couple.jpg' }: { paused: boolean; className: string; src?: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const reduced = useReducedMotion();
  useEffect(() => {
    const video = ref.current; if (!video) return;
    const observer = new IntersectionObserver(([entry]) => { setVisible(entry.isIntersecting); if (entry.isIntersecting) setLoaded(true); }, { threshold: .05 });
    observer.observe(video);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    const video = ref.current; if (!video) return;
    if (paused || reduced || !visible || !pageVisible) video.pause(); else video.play().catch(() => {});
  }, [paused, reduced, visible, pageVisible, loaded]);
  return <div className={className}><img src={poster} alt="" className="video-poster"/><video ref={ref} src={loaded && !reduced ? src : undefined} muted loop playsInline preload="none" aria-hidden="true" onPlaying={() => setReady(true)} onError={() => setReady(false)} style={{ opacity: ready ? 1 : 0 }}/></div>;
}

function MemoryRibbon({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], paused ? ['0%', '0%'] : ['4%', '-18%']);
  return <section ref={ref} className="memory-ribbon" aria-label="Little moments, beautifully kept"><p className="eyebrow">THE BEAUTY IS IN THE IN-BETWEEN</p><motion.div className="memory-track" style={{ x }}>{['embrace', 'portrait', 'wedding', 'landscape', 'couple'].map((name, index) => <figure key={name}><img src={`/images/${name}.jpg`} alt={['An embrace in the countryside', 'A portrait in natural light', 'A wedding day celebration', 'Mountains reflected in a tranquil lake', 'A couple sharing a kiss'][index]} loading="lazy" width="500" height="600"/><figcaption>0{index + 1} — {['a little closer', 'just as you are', 'all of our people', 'somewhere slow', 'always, you'][index]}</figcaption></figure>)}</motion.div><span className="ribbon-script">the days we wish would never end.</span></section>;
}

function ScrollStory({ paused, onPause, onFilm, albumPage, setAlbumPage }: { paused: boolean; onPause: () => void; onFilm: () => void; albumPage: number; setAlbumPage: (n: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);
  const [heroMood, setHeroMood] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // A JS motion-value bridge keeps the pinned element's timeline consistent across browsers.
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, 'change', value => { progress.set(value); setChapter(value < .23 ? 0 : value < .48 ? 1 : value < .73 ? 2 : 3); });
  const heroOpacity = useTransform(progress, [0, .15, .25], [1, 1, 0]);
  const heroScale = useTransform(progress, [0, .3], [1, reduced || paused ? 1 : 1.12]);
  const photographerOpacity = useTransform(progress, [.19, .26, .43, .51], [0, 1, 1, 0]);
  const photographerY = useTransform(progress, [.2, .36], [reduced || paused ? '0%' : '15%', '0%']);
  const photographerScale = useTransform(progress, [.2, .45], [reduced || paused ? 1 : 1.12, 1]);
  const flashOpacity = useTransform(progress, [.425, .445, .47], [0, reduced || paused ? 0 : .85, 0]);
  const frameOpacity = useTransform(progress, [.45, .52, .68, .76], [0, 1, 1, 0]);
  const frameScale = useTransform(progress, [.45, .58, .73], [reduced || paused ? 1 : 1.25, 1, reduced || paused ? 1 : .92]);
  const frameRotate = useTransform(progress, [.45, .62], [reduced || paused ? 0 : -9, reduced || paused ? 0 : -3]);
  const albumOpacity = useTransform(progress, [.71, .79], [0, 1]);
  const albumRotate = useTransform(progress, [.75, .95], [reduced || paused ? 0 : -155, 0]);
  const albumScale = useTransform(progress, [.72, .94], [reduced || paused ? 1 : .82, 1]);
  function goToChapter(index: number) {
    const element = ref.current; if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (element.offsetHeight - window.innerHeight) * [0, .32, .59, .96][index], behavior: reduced ? 'instant' : 'smooth' });
  }
  return <section className={`scroll-story ${reduced ? 'reduced-story' : ''}`} ref={ref} id="home" aria-label="From a moment to a memory: our four-chapter story"><div className="story-sticky">
    <motion.div className="scene hero-scene" style={{ opacity: heroOpacity }} inert={chapter !== 0} aria-hidden={chapter !== 0}>
      <motion.img className={`hero-image ${paused ? 'animation-paused' : ''}`} src="/images/couple.jpg" alt="A couple sharing a quiet kiss in golden evening light" fetchPriority="high" width="2000" height="1333" style={{ scale: heroScale }}/><AnimatePresence>{heroMood !== 2 && <motion.div key={heroMood} className="hero-moving-background" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: paused ? 0 : 1.2 }} style={{ scale: heroScale }}><AmbientVideo paused={paused || chapter !== 0} className="hero-video" src={heroMood === 0 ? '/videos/couple.mp4' : '/videos/meadow.mp4'} poster={heroMood === 0 ? '/images/couple.jpg' : '/images/meadow-poster.jpg'}/></motion.div>}</AnimatePresence><div className="hero-shade"/>
      <div className="hero-content"><motion.p className="eyebrow" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .8 }}>FOR THE MOMENTS THAT BECOME EVERYTHING</motion.p><h1><motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: 1, ease }}>Some moments.</motion.span><motion.em initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5, duration: 1, ease }}>Stay forever.</motion.em></h1><motion.p className="hero-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8, duration: 1 }}>We don’t just take photographs.<br/>We keep the way it felt.</motion.p><motion.a className="hero-link" href="#work" tabIndex={chapter === 0 ? 0 : -1} style={{ pointerEvents: chapter === 0 ? 'auto' : 'none' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>Explore our stories <ArrowUpRight size={19}/></motion.a></div>
      <div className="mood-selector" aria-label="Choose hero background">{['The feeling', 'The escape', 'The still'].map((mood, index) => <button key={mood} onClick={() => setHeroMood(index)} tabIndex={chapter === 0 ? 0 : -1} aria-pressed={heroMood === index}><i/>{mood}</button>)}</div><span className="hero-side-note">A LOVE LETTER TO THE WAY IT FELT</span>
    </motion.div>
    <motion.div className="scene camera-scene" style={{ opacity: photographerOpacity }} aria-hidden={chapter !== 1}><motion.img src="/images/artist.jpg" alt="A photographer holding a camera up to capture a moment" style={{ y: photographerY, scale: photographerScale }}/><div className="camera-shade"/><div className="viewfinder" aria-hidden="true"><i/><i/><i/><i/><span className="focus-point">+</span><span className="camera-settings">50MM &nbsp; ƒ/1.8 &nbsp; 1/250</span><span className="record-dot">● &nbsp; LIVE A LITTLE. WE’LL CATCH IT.</span></div></motion.div>
    <motion.div className="scene frame-scene" style={{ opacity: frameOpacity }} aria-hidden={chapter !== 2}><div className="frame-shadow"/><motion.figure className="memory-frame" style={{ scale: frameScale, rotate: frameRotate }}><div className="frame-mat"><img src="/images/couple.jpg" alt="The couple’s golden-hour kiss, preserved in a wooden photograph frame"/><figcaption>the day. the feeling. forever.</figcaption></div></motion.figure><span className="frame-scribble">a moment, made timeless ↗</span></motion.div>
    <motion.div className="scene album-scene" style={{ opacity: albumOpacity, pointerEvents: chapter === 3 ? 'auto' : 'none' }} aria-hidden={chapter !== 3}><motion.div className="album" style={{ scale: albumScale }}><div className="album-left album-page"><img src={albumPage === 0 ? '/images/couple.jpg' : '/images/embrace.jpg'} alt={albumPage === 0 ? 'The couple in golden light' : 'A couple walking together through the hills'} loading="lazy"/><span>{albumPage === 0 ? 'the beginning of everything' : 'all the little in-between moments'}</span></div><motion.div className="album-right album-page" style={{ rotateY: albumRotate }}><span className="album-kicker">CHAPTER {albumPage + 1} / OUR FOREVER</span><div className="album-image-grid"><img src={albumPage === 0 ? '/images/wedding.jpg' : '/images/couple.jpg'} alt="A wedding day memory" loading="lazy"/><img src={albumPage === 0 ? '/images/embrace.jpg' : '/images/wedding.jpg'} alt="Another moment from their story" loading="lazy"/></div><p>And just like that,<br/><em>we had a story worth keeping.</em></p><span className="album-page-number">0{albumPage * 2 + 2}</span></motion.div></motion.div><div className="album-controls"><button aria-label="Previous album spread" disabled={albumPage === 0} onClick={() => setAlbumPage(0)} tabIndex={chapter === 3 ? 0 : -1}><ChevronLeft size={18}/></button><span>0{albumPage + 1} / 02</span><button aria-label="Next album spread" disabled={albumPage === 1} onClick={() => setAlbumPage(1)} tabIndex={chapter === 3 ? 0 : -1}><ChevronRight size={18}/></button></div></motion.div>
    {chapter > 0 && <div className={`chapter-copy chapter-copy-${chapter}`}><AnimatePresence mode="wait"><motion.div key={chapter} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: reduced ? 0 : .5 }}><p className="eyebrow">{chapters[chapter].number} / {chapters[chapter].label.toUpperCase()}</p><h2>{chapters[chapter].heading}</h2><p>{chapters[chapter].description}</p></motion.div></AnimatePresence></div>}
    <motion.div className="camera-flash" style={{ opacity: flashOpacity }} aria-hidden="true"/>
    <div className={`story-bottom ${chapter > 1 ? 'story-bottom-dark' : ''}`}><button className="scroll-cue" onClick={() => chapter < 3 ? goToChapter(chapter + 1) : document.querySelector('#story')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' })}><span className="scroll-circle"><ArrowDown size={16}/></span><span>SCROLL TO FEEL THE STORY<small>One moment. A lifetime of memories.</small></span></button><div className="chapter-nav" aria-label="Story chapters">{chapters.map((ch, i) => <button key={ch.number} className={chapter === i ? 'chapter-button current' : 'chapter-button'} aria-label={`Go to chapter ${ch.number}: ${ch.label}`} aria-current={chapter === i ? 'step' : undefined} onClick={() => goToChapter(i)}><span>{ch.number}</span><i/></button>)}</div><div className="hero-film"><button onClick={onFilm} className="film-thumb" aria-label="Watch the studio film"><img src="/images/embrace.jpg" alt=""/><Play size={15} fill="currentColor"/></button><button onClick={onFilm}>A LITTLE LOVE, IN MOTION<small>Watch our film <ArrowUpRight size={12}/></small></button><button className="pause-button icon-button" onClick={onPause} aria-label={paused ? 'Enable motion and background video' : 'Pause motion and background video'} aria-pressed={paused}>{paused ? <Play size={14}/> : <Pause size={14}/>}</button></div></div>
    <motion.div className="story-progress" style={{ scaleX: progress }}/>
  </div></section>;
}
