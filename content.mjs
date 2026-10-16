export const clauses = [
  {
    formal: 'We hereby propose a strategic partnership.',
    revised: "We’re glad you’re here, Mr. Zou.",
    zh: { label: '认识', old: '我们谨此提议建立战略合作关系。', next: '很高兴认识您，邹老师。', note: '“战略合作”太郑重了。我们想说的，其实是一句招呼。', action: '采用这句招呼', nextLabel: '再看看「期待」' },
    en: { label: 'Hello', old: 'A rather formal introduction.', next: 'A simpler way to say hello.', note: '“Strategic partnership” feels a little much. What we really mean is hello.', action: 'Keep this hello', nextLabel: 'Revise our hopes' }
  },
  {
    formal: 'Our objective is to achieve mutually beneficial outcomes.',
    revised: 'We look forward to learning with you.',
    zh: { label: '期待', old: '我们的目标是实现互惠互利的成果。', next: '接下来的课堂，我们很期待。', note: '这段关系才刚刚开始。与其承诺某种成果，不如说出真实的期待。', action: '留下这份期待', nextLabel: '最后看看「欢迎」' },
    en: { label: 'Our hopes', old: 'An ambitious objective.', next: 'Something we can honestly look forward to.', note: 'We’re only just getting to know one another. An honest hope feels better than a promised outcome.', action: 'Keep this hope', nextLabel: 'Revise the closing' }
  },
  {
    formal: 'We respectfully await your formal approval.',
    revised: 'Welcome to Class 2603.',
    zh: { label: '欢迎', old: '我们谨候您的正式批准。', next: '欢迎来到2603班。', note: '欢迎一位新老师，不需要等一份批复。这一句，现在就可以送给您。', action: '就用这句欢迎', nextLabel: '回看我们的修订' },
    en: { label: 'Welcome', old: 'A closing that asks for approval.', next: 'A welcome needs no signature.', note: 'Welcoming a new teacher doesn’t need formal approval. This is something we can say right now.', action: 'Keep this welcome', nextLabel: 'Review our changes' }
  }
];

export const copy = {
  zh: {
    pageTitle: '致邹老师 · 一份意想不到的提案 · 2603班',
    skip: '跳至正文', classLabel: '来自2603班', gift: '一份给新班主任的欢迎礼物',
    scenes: ['邀请', '提案', '修订', '开始'], languageLabel: 'Switch to English', motionLabel: '减弱动效', motionFull: '动效 开', motionReduce: '动效 减',
    invitationTitle: '致邹老师', invitationSub: '一份意想不到的提案', invitationText: '我们认真准备了一份提案。\n也许，认真得有点过头了。',
    open: '打开这份提案', coverTop: '谨呈 · 邹老师', coverBottom: '由2603班发出', coverFoot: '关于一次新的相遇',
    draftTitle: '关于一个好的开始。', toLabel: '致', fromLabel: '来自', subjectLabel: '主题', to: '邹老师', from: '2603班', subject: '一个好的开始',
    draftIntro: '我们想用您教的商务英语，认真地打个招呼。于是，先拟了一份提案。',
    draftBody: '以下是我们的初稿。格式足够正式，措辞也逐一斟酌过。不过，读到最后，我们决定再改一改。',
    draftSign: '此致，2603班', draftMemo: '是不是……太正式了？', noteToggle: '读一读这条边注', noteTitle: '写到这里，我们停了一下。', noteBody: '“战略合作”“互惠互利”“正式批准”……每个词都很认真，却不像我们真正想对您说的话。', editDraft: '把它改成我们的语气', draftFooter: '初稿，待修订。',
    revisionTitle: '有些话，\n不必那么正式。', revisionIntro: '拖动纸页下方的滑块，看看另一种说法。\n也可以直接轻触“采用”按钮。', revisionTabs: '选择要修订的句子', revisedCount: '已修订', countUnit: '处', originalLabel: '原稿', newLabel: '我们的意思', sliderLabel: '拖动滑块揭开真诚表达', formal: '正式', sincere: '自然', accepted: '这句，像我们了。', undo: '还原这处修订', trace: '查看修订痕迹', traceEmpty: '修订后，原稿和新表达会一起保留在这里。', incomplete: '三处措辞，等你亲手改写。', oneLeft: '把剩下的话，也改成我们的语气。', assemble: '把三句话，合成一封信', ready: '三处修订。一封真正想送出的信。', backDraft: '回看初稿', announce: '已采用新的表达。',
    welcomeTitle: '很高兴认识您。', welcomeKicker: '提案的最后，成了一句欢迎。', salutation: '邹老师：', letterLead: '我们是2603班。', letterBody: '想用您教的商务英语，认真地打个招呼。写了又改，还是觉得这三句话最合适。', letterClose: '我们还在慢慢认识彼此。接下来的课堂，留给我们一起写。', signature: '2603班 · 敬赠邹老师', finalNote: '故事才刚刚开始。', replay: '重新打开这份礼物', review: '看看它是怎么改成的', footer: '献给一次尚未展开的相遇。', storageNote: '这次浏览无法保存进度，仍可完整体验。', restartAnnounce: '礼物已重新折好，可以再次打开。'
  },
  en: {
    pageTitle: 'Dear Mr. Zou · An Unexpected Proposal · Class 2603',
    skip: 'Skip to the story', classLabel: 'From Class 2603', gift: 'A welcome for our new homeroom teacher',
    scenes: ['Invitation', 'Proposal', 'Revision', 'Beginning'], languageLabel: '切换为中文', motionLabel: 'Reduce motion', motionFull: 'Motion on', motionReduce: 'Less motion',
    invitationTitle: 'Dear Mr. Zou', invitationSub: 'An unexpected proposal', invitationText: 'We prepared a very proper proposal.\nPerhaps a little too proper.',
    open: 'Open the proposal', coverTop: 'To · Mr. Zou', coverBottom: 'From Class 2603', coverFoot: 'On getting to know each other',
    draftTitle: 'A good beginning.', toLabel: 'To', fromLabel: 'From', subjectLabel: 'Subject', to: 'Mr. Zou', from: 'Class 2603', subject: 'A good beginning',
    draftIntro: 'You teach Business English. We thought we’d put it to work and write you a proper introduction.',
    draftBody: 'This is our first draft. The format is formal. The words are carefully chosen. But when we read it back, we thought it needed a few changes.',
    draftSign: 'Yours sincerely, Class 2603', draftMemo: 'A little too formal, perhaps?', noteToggle: 'Read our margin note', noteTitle: 'This is where we paused.', noteBody: '“Strategic partnership.” “Mutually beneficial outcomes.” “Formal approval.” All carefully chosen. None quite what we wanted to say.', editDraft: 'Make it sound like us', draftFooter: 'First draft. A few changes to come.',
    revisionTitle: 'Some words\ncan be simpler.', revisionIntro: 'Slide the paper’s handle to reveal another way to say it.\nOr tap the button to keep the new wording.', revisionTabs: 'Choose a sentence to revise', revisedCount: 'Revised', countUnit: '', originalLabel: 'The draft', newLabel: 'What we mean', sliderLabel: 'Slide to reveal the new wording', formal: 'Formal', sincere: 'Natural', accepted: 'That sounds like us.', undo: 'Restore this sentence', trace: 'See the revision history', traceEmpty: 'Your revisions will keep both the original and the new wording here.', incomplete: 'Three sentences, ready for your touch.', oneLeft: 'A few more words to make our own.', assemble: 'Make these words a letter', ready: 'Three revisions. One letter we really mean.', backDraft: 'Read the first draft', announce: 'New wording kept.',
    welcomeTitle: 'We’re glad you’re here.', welcomeKicker: 'A proposal, finally in our own words.', salutation: 'Dear Mr. Zou,', letterLead: 'We’re Class 2603.', letterBody: 'We thought we’d use the Business English you teach to say hello. After a little editing, these are the words we wanted to keep.', letterClose: 'There is a lot we don’t know about one another yet. We look forward to writing the next part together.', signature: 'A welcome to Mr. Zou, from Class 2603', finalNote: 'Some stories are worth beginning.', replay: 'Open the gift again', review: 'See how the words changed', footer: 'For a story that is only just beginning.', storageNote: 'Progress can’t be saved in this browser. The full story is still available.', restartAnnounce: 'The gift is folded again, ready to open.'
  }
};
