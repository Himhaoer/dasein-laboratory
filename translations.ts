import { ViewMode } from "./types";

export const translations = {
  en: {
    nav: {
      [ViewMode.DASHBOARD]: 'Constellation',
      [ViewMode.MIRROR]: 'Logbook',
      [ViewMode.THEATER]: 'Tension Lab',
      [ViewMode.ARCHIVE]: 'Archive',
      subtitle: 'Narrative Lab'
    },
    core: {
      title: 'Narrative Constellation',
      quote: 'We are not the authors of our desires, but we can become the authors of our narrative.',
      loading: 'The Old Teacher is observing your history...',
      insightBtn: 'Refresh Constellation',
    },
    mirror: {
      init: "I am the Mirror. Record your unstructured thoughts. Your words form the raw material of your constellation.",
      placeholder: "Log your stream of consciousness...",
      ego: 'Subject',
      dasein: 'Mirror'
    },
    theater: {
      title: 'Tension Laboratory',
      quote: 'Isolate a specific knot from your logbook to deconstruct it here.',
      placeholder: "Describe a recurring conflict or a situation where you feel 'stuck'...",
      cta: 'Deconstruct Tension',
      loading: 'Analyzing Structure...',
      idTitle: 'Id (Impulse)',
      superegoTitle: 'Superego (Mandate)',
      symptomTitle: 'The Symptom (Knot)',
      synthesisTitle: 'Authorship (Re-entry)',
      stateLabel: 'State',
      reset: 'New Inquiry'
    },
    archive: {
      title: 'Narrative Archive',
      empty: 'The timeline is empty. Begin by recording a log.',
      analyzeAction: 'Deconstruct in Lab',
      logType: 'Raw Log',
      analysisType: 'Structural Analysis',
      dateFormat: (date: number) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
  },
  zh: {
    nav: {
      [ViewMode.DASHBOARD]: '星图',
      [ViewMode.MIRROR]: '日志',
      [ViewMode.THEATER]: '张力',
      [ViewMode.ARCHIVE]: '档案',
      subtitle: '叙事实验室'
    },
    core: {
      title: '叙事星图',
      quote: '我们不是欲望的作者，但我们可以成为叙事的作者。',
      loading: '老教师正在观测你的叙事档案...',
      insightBtn: '重构星图',
    },
    mirror: {
      init: "我是镜像。在此记录你的非结构化思绪。你的每一句话都是构建星图的原材料。",
      placeholder: "捕捉你的意识流...",
      ego: '主体',
      dasein: '镜像'
    },
    theater: {
      title: '张力实验室',
      quote: '将日志中模糊的困惑提取出来，在此处进行结构化解剖。',
      placeholder: "描述一个反复出现的冲突，或让你感到“卡住”的困境...",
      cta: '解构张力',
      loading: '正在解析结构...',
      idTitle: '本我 (The Id)',
      superegoTitle: '超我 (The Superego)',
      symptomTitle: '症状 (The Knot)',
      synthesisTitle: '作者权 (Authorship)',
      stateLabel: '状态',
      reset: '新的探问'
    },
    archive: {
      title: '叙事档案',
      empty: '时间轴是一片空白。请从记录日志开始。',
      analyzeAction: '送入实验室解构',
      logType: '原初日志',
      analysisType: '结构分析',
      dateFormat: (date: number) => new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }
  }
};
