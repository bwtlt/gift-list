import React from 'react'
import '../styles/globals.css'
import { AuthUserProvider } from '../context/AuthUserContext'
import Maintenance from './maintenance'
import PropTypes from 'prop-types'
import localFont from 'next/font/local'

const playfulChristmasFont = localFont({
  src: [
    {
      path: '../public/fonts/playful_christmas-webfont.woff2',
      weight: '400'
    }
  ]
})
const amandineFont = localFont({
  src: [
    {
      path: '../public/fonts/amandine-webfont.woff2',
      weight: '400'
    }
  ]
})
const learningCurveFont = localFont({
  src: [
    {
      path: '../public/fonts/learningcurve-webfont.woff2',
      weight: '400'
    }
  ]
})

function MyApp ({ Component, pageProps }) {
  return <AuthUserProvider>
    {process.env.NEXT_PUBLIC_MAINTENANCE_MODE
      ? <Maintenance />
      : <>
        <style jsx global>{`
        :root {
          /* ... */
          --playful-christmas-font: ${playfulChristmasFont.style.fontFamily};
          --learningcurve-font: ${learningCurveFont.style.fontFamily};
          --amandine-font: ${amandineFont.style.fontFamily};
        }
      `}</style>
        <Component {...pageProps} />
      </>
    }
  </AuthUserProvider>
}
MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object
}

export default MyApp
