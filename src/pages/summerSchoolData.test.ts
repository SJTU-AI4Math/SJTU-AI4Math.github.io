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

  it('deep-compares each course with its own speaker and ordered topics', () => {
    expect(structuredCourses()).toEqual(parseCourses(plan))
  })

  it('deep-compares project categories, descriptions, and per-project examples', () => {
    expect(structuredProjects()).toEqual(parseProjects(plan))
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
