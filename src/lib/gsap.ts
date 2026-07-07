import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrambleTextPlugin, SplitText);

export { gsap, ScrollTrigger, SplitText };
