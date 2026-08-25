import { describe, expect, it } from 'vitest'
import plan from '../../assets/source/Plan.md?raw'
import { campusLocations, courses, notes, projects, schedule } from './summerSchoolData'

function cleanMarkdown(value: string) {
  return value
    .replace(/^>\s?/, '')
    .replace(/^\*\s?/, '')
    .replace(/\*\*|`/g, '')
    .trim()
}

function canonicalTime(value: string) {
  return value
    .replace('·', '')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, '')
}

function parseSchedule(source: string) {
  const lines = source.split('\n')
  const header = lines.find((line) => line.startsWith('| 天数'))
  if (!header) throw new Error('Plan schedule header is missing')
  const headings = header.split('|').slice(1, 6).map((cell) => cell.trim())
  const rows = lines.filter((line) => /^\|\s*8\.\d+/.test(line))

  return rows.map((line) => {
    const cells = line.split('|').slice(1, 6).map((cell) => cell.trim())
    const slots = cells.slice(1, 4).flatMap((content, index) => (
      content === '--' ? [] : [{ time: canonicalTime(headings[index + 1]), content }]
    ))
    return {
      date: cells[0],
      location: cells[4],
      slots,
    }
  })
}

function structuredSchedule() {
  return schedule.map((day) => {
    const date = day.date.zh.match(/(\d+) 月 (\d+) 日/)
    if (!date) throw new Error(`Invalid structured date: ${day.date.zh}`)
    return {
      date: `${Number(date[1])}.${Number(date[2])}`,
      location: day.location.zh,
      slots: day.slots.map((item) => ({
        time: canonicalTime(item.time.zh),
        content: item.content.zh,
      })),
    }
  })
}

function parseCourses(source: string) {
  const result: Array<{ code: string; title: string; speaker: string; topics: string[] }> = []
  let current: (typeof result)[number] | null = null

  for (const line of source.split('\n')) {
    if (line.startsWith('## ') && current) {
      current = null
      continue
    }
    const heading = line.match(/^> 课程 ([^：]+)：(.+)$/)
    if (heading) {
      current = { code: heading[1], title: heading[2].trim(), speaker: '', topics: [] }
      result.push(current)
      continue
    }
    if (!current) continue
    const speaker = line.match(/^> 主讲：(.+)$/)
    if (speaker) {
      current.speaker = speaker[1].trim()
      continue
    }
    if (/^> \* /.test(line)) current.topics.push(cleanMarkdown(line))
  }
  return result
}

function structuredCourses() {
  return courses.map((course) => ({
    code: course.code,
    title: course.title.zh,
    speaker: course.speaker.zh,
    topics: course.topics.map((topic) => topic.zh),
  }))
}

function parseProjects(source: string) {
  const result: Array<{
    category: string
    title: string
    description: string
    examples: string[]
  }> = []
  let current: (typeof result)[number] | null = null

  for (const line of source.split('\n')) {
    const heading = line.match(/^> 课题【([^】]+)】：(.+)$/)
    if (heading) {
      current = {
        category: heading[1],
        title: heading[2].trim(),
        description: '',
        examples: [],
      }
      result.push(current)
      continue
    }
    if (!current || line === '> ---') continue
    if (/^> \* /.test(line)) {
      current.examples.push(cleanMarkdown(line))
    } else if (/^> .+/.test(line) && current.description === '') {
      current.description = cleanMarkdown(line)
    }
  }
  return result
}

function structuredProjects() {
  return projects.map((project) => ({
    category: project.category.zh,
    title: project.title.zh,
    description: project.description.zh,
    examples: (project.examples ?? []).map((example) => example.zh),
  }))
}

function parseNotes(source: string) {
  return source
    .split('\n')
    .filter((line) => /^\d+\. /.test(line))
    .map((line) => line.replace(/^\d+\. /, '').trim())
}

describe('summer school Plan.md fidelity', () => {
  it('deep-compares ordered dates, venues, time slots, and duplicate activities', () => {
    expect(structuredSchedule()).toEqual(parseSchedule(plan))
  })

  it('removes every August 23 planning reference', () => {
    expect(schedule.some(({ date }) => date.zh === '8 月 23 日')).toBe(false)
    expect(plan).not.toMatch(/8\.23|8 月 23|23 日晚/)
    expect(notes.some(({ zh }) => /8\.23|23 日晚/.test(zh))).toBe(false)
    expect(campusLocations.some(({ description }) => /8 月 23|23 日晚/.test(description.zh))).toBe(false)
  })

  it('deep-compares each course with its own speaker and ordered topics', () => {
    expect(structuredCourses()).toEqual(parseCourses(plan))
  })

  it('assigns course 4A to 解淑涵（算算）', () => {
    const course = courses.find(({ code }) => code === '4A')
    expect(course?.speaker).toEqual({
      zh: '解淑涵（算算）',
      en: 'Shuhan Xie (Suansuan)',
    })
    expect(parseCourses(plan).find(({ code }) => code === '4A')?.speaker).toBe('解淑涵（算算）')
  })

  it('removes categorical semantics from course 2A', () => {
    const course = courses.find(({ code }) => code === '2A')
    expect(course?.topics.some(({ zh }) => zh.includes('范畴语义'))).toBe(false)
    expect(plan).not.toContain('范畴语义')
  })

  it('removes foundations of program verification from course 4B', () => {
    const course = courses.find(({ code }) => code === '4B')
    expect(course?.topics.some(({ zh }) => zh.includes('程序验证基础'))).toBe(false)
    expect(plan).not.toContain('程序验证基础')
  })

  it('deep-compares project categories, descriptions, and per-project examples', () => {
    expect(structuredProjects()).toEqual(parseProjects(plan))
  })

  it('adds Lean4TypeTheory as the second functional-programming project', () => {
    const existingIndex = projects.findIndex(({ id }) => id === 'verified-game')
    const projectIndex = projects.findIndex(({ id }) => id === 'lean4-type-theory')
    expect(projectIndex).toBe(existingIndex + 1)
    expect(projects[projectIndex]).toMatchObject({
      category: { zh: '函数式编程', en: 'Functional Programming' },
      title: { zh: 'Lean4TypeTheory', en: 'Lean4TypeTheory' },
      description: {
        zh: '使用 Lean 4 作为元语言进行函数式编程，在无类型 λ-演算、简单类型 λ-演算以及各类不同类型论中选择一至多种重新建模，实现基本的自动化以及尝试对部分算法、理论的正确性和一致性进行证明。',
        en: 'Use Lean 4 as a metalanguage for functional programming. Re-model one or more of the untyped lambda calculus, simply typed lambda calculus, and various type theories; implement basic automation; and attempt to prove the correctness and consistency of selected algorithms and theories.',
      },
    })
  })

  it('deep-compares both source notes in order', () => {
    expect(notes.map((note) => note.zh)).toEqual(parseNotes(plan))
  })

  it('keeps the four measured marker centers in annotated-map order', () => {
    expect(campusLocations.map(({ id, x, y }) => ({ id, x, y }))).toEqual([
      { id: 'science-buildings', x: 5.76, y: 27.46 },
      { id: 'yulan-canteen', x: 26.44, y: 54.16 },
      { id: 'guangbiao-building', x: 37.41, y: 63.89 },
      { id: 'second-dining-building', x: 43.39, y: 70.62 },
    ])
  })
})
