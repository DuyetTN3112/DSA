import type { RichLesson } from './lesson-types';
import { KINDERGARTEN_1_LESSONS } from './kindergarten-1';
import { K3_LESSONS } from './k3';
import { KINDERGARTEN_2_LESSONS } from './kindergarten-2';
import { READING_LESSONS } from './reading';
import { ARRAYS_LESSONS } from './arrays';
import { PYTHON_BASICS_LESSONS } from './python-basics';
import { CODE_LABS_1_LESSONS } from './code-labs-1';
import { CODE_LABS_2_LESSONS } from './code-labs-2';
import { ALGORITHMS_LESSONS } from './algorithms';
import { HASHMAP_LESSONS } from './hashmap';
import { RECURSION_LESSONS } from './recursion';
import { STRUCTURES_LESSONS } from './structures';
import { GRAPHS_DP_LESSONS } from './graphs-dp';
import { DEBUG_LESSONS } from './debug';
import { PROJECTS_LESSONS } from './projects';
import { APPS_1_LESSONS } from './apps-1';
import { APPS_2_LESSONS } from './apps-2';
import { W1_LESSONS } from './workshop-w1';
import { W2_LESSONS } from './workshop-w2';
import { W3_LESSONS } from './workshop-w3';
import { W4_LESSONS } from './workshop-w4';
import { W5_LESSONS } from './workshop-w5';
import { W6_LESSONS } from './workshop-w6';
import { W7_LESSONS } from './workshop-w7';
import { W8_LESSONS } from './workshop-w8';
import { W9_LESSONS } from './workshop-w9';
import { W10_LESSONS } from './workshop-w10';
import { W11_LESSONS } from './workshop-w11';
import { W12_LESSONS } from './workshop-w12';

export const ALL_LESSONS: RichLesson[] = [
  ...KINDERGARTEN_1_LESSONS,
  ...K3_LESSONS,
  ...KINDERGARTEN_2_LESSONS,
  ...READING_LESSONS,
  ...ARRAYS_LESSONS,
  ...PYTHON_BASICS_LESSONS,
  ...CODE_LABS_1_LESSONS,
  ...CODE_LABS_2_LESSONS,
  ...ALGORITHMS_LESSONS,
  ...HASHMAP_LESSONS,
  ...RECURSION_LESSONS,
  ...STRUCTURES_LESSONS,
  ...GRAPHS_DP_LESSONS,
  ...DEBUG_LESSONS,
  ...PROJECTS_LESSONS,
  ...APPS_1_LESSONS,
  ...APPS_2_LESSONS,
  ...W1_LESSONS,
  ...W2_LESSONS,
  ...W3_LESSONS,
  ...W4_LESSONS,
  ...W5_LESSONS,
  ...W6_LESSONS,
  ...W7_LESSONS,
  ...W8_LESSONS,
  ...W9_LESSONS,
  ...W10_LESSONS,
  ...W11_LESSONS,
  ...W12_LESSONS,
];

export const LESSON_MAP: Record<string, RichLesson> = Object.fromEntries(
  ALL_LESSONS.map((l) => [l.id, l]),
);
