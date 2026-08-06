import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Card } from '../components/Card'
import { courses, localize } from './summerSchoolData'

export function LecturePage() {
  const { lectureSlug } = useParams({ from: '/summer-school/2026/lectures/$lectureSlug' })
  const { i18n, t } = useTranslation()
  const course = courses.find((item) => item.slug === lectureSlug)

  if (!course) return <p>{t('summerSchool.lectureNotice')}</p>

  return (
    <div className="lecture-page">
      <Link
        className="lecture-back-link"
        to="/summer-school/2026"
        hash="courses"
        activeOptions={{ exact: true }}
      >
        ← {t('summerSchool.backToSummerSchool')}
      </Link>
      <h1>{localize(course.title, i18n.resolvedLanguage)}</h1>
      <Card
        tone={course.tone}
        eyebrow={`${t('summerSchool.course')} ${course.code}`}
        title={t('summerSchool.lectureNotes')}
        meta={`${t('summerSchool.speaker')} · ${localize(course.speaker, i18n.resolvedLanguage)}`}
      >
        <p>{t('summerSchool.lectureNotice')}</p>
      </Card>
    </div>
  )
}
