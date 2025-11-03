const knownAbbreviations = [
  // Titles (Sir, Doctor, etc)
  'Sr.', 'Sra.', 'Srta.', 'Srs.', 'Sras.', 'Dr.', 'Dra.', 'Drs.', 'Dras.',
  'Lic.', 'Licda.', 'Licdo.', 'Licds.', 'Ings.', 'Ing.', 'Arq.', 'Arqs.', 'Prof.', 'Profa.', 'Profs.', 'Profas.',

  // Generals
  'etc.', 'e.g.', 'i.e.', 'p.ej.', 'p.e.', 'a.m.', 'p.m.',
  'núm.', 'núms.', 'n.os', 'n.os.', 'ud.', 'uds.',
  'c/ap.', 'c/u.', 's/n.', 'av.', 'pto.', 'ptos.', 'pág.', 'págs.', 'vol.', 'vols.', 'ed.', 'eds.', 'cap.', 'caps.',
  'mín.', 'máx.', 'aprox.', 'ant.', 'sig.', 'hist.', 'biol.', 'quím.', 'mat.', 'psic.',
  'adj.', 'adv.', 'art.', 'arts.', 'vb.', 'vbs.', 'sust.', 'susts.', 'prep.', 'preps.',

  // Legal written in Spanish
  'Art.', 'Arts.', 'Inc.', 'Incs.', 'const.', 'Cód.', 'Códs.',
  'C.C.', 'C.P.', 'C.N.', 'DNU.', 'DTO.', 'Res.', 'Disp.', 'Disps.', 'C.P.C.C.', 'C.C.Y.C.',
  'expte.', 'exptes.', 'fs.', 'fjs.', 'op.', 'cf.', 'cit.', 'loc. cit.', 'ut supra.', 'vgr.', 'ap.', 'cfr.', 'ss.',

  // Latin-legal written in Spanish
  'et al.', 'ibid.', 'ibíd.', 'op. cit.', 'loc. cit.', 'id.', 'vs.', 'a priori.', 'a posteriori.', 'sine die.'
]

exports.knownAbbreviations = knownAbbreviations
