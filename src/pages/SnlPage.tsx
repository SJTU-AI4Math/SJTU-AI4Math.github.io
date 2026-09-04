import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Card } from '../components/Card'
import {
  documentCards,
  localizeSnlText,
  repositoryCards,
  type SnlCardData,
} from './snlPageData'

function SnlEntryCard({ card }: { card: SnlCardData }) {
  const { i18n } = useTranslation()
  const content = (
    <Card className="snl-entry-card" tone={card.kind === 'internal' ? 'violet' : 'blue'} title={card.title}>
      <p>{localizeSnlText(card.description, i18n.resolvedLanguage)}</p>
      <span className="snl-card-action" aria-hidden="true">{card.kind === 'internal' ? '→' : '↗'}</span>
    </Card>
  )

  return card.kind === 'internal' ? (
    <Link className="snl-card-link" to={card.to} aria-label={card.title}>
      {content}
    </Link>
  ) : (
    <a className="snl-card-link" href={card.href} aria-label={card.title} target="_blank" rel="noreferrer">
      {content}
    </a>
  )
}

export function SnlPage() {
  const { t } = useTranslation()

  return (
    <div className="snl-page">
      <header className="snl-hero">
        <span className="snl-hero-kicker">SJTU AI4Math</span>
        <h1>SNL</h1>
        <p>{t('snl.lead')}</p>
      </header>

      <div className="snl-columns">
        <section className="snl-column" aria-labelledby="snl-documents-title">
          <header className="snl-column-header">
            <h2 id="snl-documents-title">{t('snl.documents')}</h2>
            <p>{t('snl.documentsIntro')}</p>
          </header>
          <div className="snl-card-grid">
            {documentCards.map((card) => <SnlEntryCard key={card.title} card={card} />)}
          </div>
        </section>

        <section className="snl-column" aria-labelledby="snl-repositories-title">
          <header className="snl-column-header">
            <h2 id="snl-repositories-title">{t('snl.repositories')}</h2>
            <p>{t('snl.repositoriesIntro')}</p>
          </header>
          <div className="snl-card-grid">
            {repositoryCards.map((card) => <SnlEntryCard key={card.title} card={card} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
