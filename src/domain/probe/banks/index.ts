// Gộp mọi ngân hàng probe theo chủ đề thành một registry duy nhất.
import type { ProbeBank } from '../../types';
import { basicsBanks } from './basics';
import { foundationBanks } from './foundation';
import { kindergartenBanks } from './kindergarten';
import { coreBanks } from './core';
import { structuresBanks } from './structures';
import { recursionBanks } from './advanced-recursion';
import { linkedlistBanks } from './advanced-linkedlist';
import { treeBanks } from './advanced-tree';
import { graphBanks } from './advanced-graph';
import { dpBanks } from './advanced-dp';
import { debugBanks } from './advanced-debug';
import { miniBanks } from './projects-mini';
import { opsBanks } from './projects-ops';
import { systemsBanks } from './projects-systems';
import { syntaxBanks } from './projects-syntax';
import { codeAlgoBanks } from './code-algo';
import { codeAppsBanks } from './code-apps';

export const PROBE_BANKS: Record<string, ProbeBank> = {
  ...basicsBanks,
  ...foundationBanks,
  ...kindergartenBanks,
  ...coreBanks,
  ...structuresBanks,
  ...recursionBanks,
  ...linkedlistBanks,
  ...treeBanks,
  ...graphBanks,
  ...dpBanks,
  ...debugBanks,
  ...miniBanks,
  ...opsBanks,
  ...systemsBanks,
  ...syntaxBanks,
  ...codeAlgoBanks,
  ...codeAppsBanks,
};
