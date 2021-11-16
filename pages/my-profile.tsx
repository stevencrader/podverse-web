import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PV } from '~/resources'

export default function Episodes() {
  const { t } = useTranslation()
  return (
    <div>
      <Head>
        <title>{t('My Profile')}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>My Profile!!!</p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, locale } = ctx
  const { cookies } = req

  return {
    props: {
      ...(await serverSideTranslations(locale, PV.i18n.fileNames.all)),
      serverCookies: cookies
    }
  }
}
