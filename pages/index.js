import React, { useState, useEffect } from 'react'
import firebase from '../lib/firebase'
import 'firebase/firestore'
import 'firebase/storage'
import Head from 'next/head'
import Image from 'next/legacy/image'
import Item from './components/Item'
import Script from 'next/script'
import styles from '../styles/BirthList.module.scss'
import { useAuth } from '../context/AuthUserContext'

const email = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMAIL
const db = firebase.firestore()
const CATEGORIES = ['Jeux de construction',
  'Jeux de société',
  'Jeux d\'éveil',
  'Jeux éducatifs',
  'Plein air'
]

export default function Home () {
  const [category, setCategory] = useState('Tout')
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const { authUser, signInWithEmailAndPassword } = useAuth()
  const [items, setItems] = useState([])
  const [giftedItems, setGiftedItems] = useState([])
  const [loadedDb, setLoadedDb] = useState(false)

  useEffect(() => {
    if (authUser && !loadedDb) {
      setLoading(true)
      setGiftedItems([])
      setItems([])
      db.collection('christmas2023').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const item = doc.data()
          item.id = doc.id
          if (item.gifted && !item?.number) {
            setGiftedItems(giftedItems => [...giftedItems, item])
          } else {
            setItems(items => [...items, item])
          }
        })
      })
      setLoading(false)
      console.log('Items retrieved succesfully')
      setLoadedDb(true)
    }
  }, [authUser, loadedDb])

  const filterItem = (item) => {
    const categoryMatches = category === 'Tout' || item.category === category
    return !item.hidden && categoryMatches
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Liste au Père Noël</title>
        <meta name="description" content="La liste au Père Noël de Romy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Script src="https://kit.fontawesome.com/c9688da9a5.js" crossorigin="anonymous"></Script>
        <div className={styles.header}>
          <div className={styles.title}>(La liste au Père Noël de Romy)</div>
        </div>
        <div className={styles.body}>
          {loading && <div>Chargement en cours...</div>}
          {!loading && authUser === null &&
            <form className={styles.login} onSubmit={async (e) => {
              setLoading(true)
              signInWithEmailAndPassword(email, password)
                .then(() => {
                  console.log('Log in succesful')
                })
                .catch((error) => {
                  console.error(error)
                })
              e.preventDefault()
            }}>
              <label htmlFor="password">Mot de passe : </label>
              <input className={styles.passwordField} type="password" id="password" name="password" required onChange={(event) => setPassword(event.target.value)} />
              <input type="submit" value="Entrer" className={styles.gifterFormButton} />
            </form>
          }
          {authUser &&
            <>
              <div className={styles.intro}>
                <div className={styles.introText}>
                  <p className={styles.introRaw}>
                    Cher Père Noël,
                    <br></br>
                    Je m&apos;appelle Romy Anouch Watelet, j&apos;ai 11 mois,
                    <br></br>
                    Et c&apos;est la première fois que je t&apos;écris,
                    <br></br>
                    Le Nöel dernier était un peu particulier : je n&apos;avais que quelques jours, mais ralala qu&apos;est ce que j&apos;avais été gâtée, merci encore !
                    <br></br>
                    Bon faut que je te dise, mes parents m&apos;ont embarqué dans une aventure à bord d&apos;une maison sur roue, moi j&apos;aime bien vivre dans cette petite maison, je rencontre plein de monde et c&apos;est plutôt cosy. Mais alors s&apos;ils pensent que tu arriveras à déposer tout ce que j&apos;ai demandé là dedans mouhaha ils se trompent mes parents. Non non, le mieux pour la livraison des cadeaux, c&apos;est chez mes papys et mamies, il y aura un joli sapin de Noël éclairé et de la place pour garer ton traineau !
                    <br></br>
                    Père Noel, tu peux me croire sur parole : je suis vraiment très très sage,
                    <br></br>
                    Est-ce que dormir la nuit ça compte pour avoir des cadeaux ? (oups...)
                    <br></br>
                    Je suis encore trop petite pour découper moi même mes souhaits dans les catalogues de jouets.
                    <br></br>
                    Mais Papa et Mama m&apos;ont observé m&apos;amuser avec mon copain Noé et mes cousines et ont noté quelques jouets que j&apos;aimerais bien avoir pour continuer à apprendre, bouger et me divertir.
                    <br></br>
                    Les voilà,
                    <br></br>
                    Merci Père Noël.
                    <br></br>
                    RAW.
                  </p>
                  <p className={styles.introParents}>
                  Note de Papa et Mama : vous savez ce que nous pensons du marché de l&apos;occasion, il existe plus de mille jouets sur les plateformes comme Le bon coin, Vinted ou encore dans les vide-greniers... alors même si les lutins du Père Noël travaillent sûrement très très bien, on aimerait vraiment que vous fassiez l&apos;effort de vous tourner vers de l&apos;occasion (dans la mesure du possible),
                  <br></br>
Il faut penser à la planète qu&apos;on laissera à Romy plus tard...
                  <br></br>
Ce n&apos;est pas une liste exhaustive, faites vous plaisir, cela lui fera forcement plaisir.
                  <br></br>
Nous ne tenons pas à savoir qui offre quoi, pour avoir la surprise nous aussi (Oui, on adore la Magie de Noël !)
                  <br></br>
Alors il vous suffit de cliquer sur &quot;Réserver&quot;
                  <br></br>
Vous pouvez revenir en arrière à tout moment.
                  <br></br>
Merci.
                  <br></br>
L & B.
                  </p>
                </div>
                <div className={styles.introImageContainer}>
                  <Image className={styles.introImage} src="/intro.jpeg" layout="fill" objectFit="contain" alt="Les heureux parents"></Image>
                </div>
              </div>
              <form action="#" className={styles.filterControls}>
                <label>Filtres : </label>
                <select className={styles.select} name="category" id="categorySelect" value={category} onChange={(e) => {
                  setCategory(e.target.value)
                }}>
                  <option value="Tout">Catégorie...</option>
                  {CATEGORIES.map((cat) => {
                    return (<option value={cat} key={cat}>{cat}</option>)
                  })}
                </select>
                <button className={styles.filterButton} onClick={(e) => {
                  e.preventDefault()
                  setCategory('Tout')
                }}>Réinitialiser</button>
              </form>

              <div className={styles.sublistTitle}>Catégorie : {category}</div>
              <>
                <div className={styles.list}>
                  {items.filter((item) => filterItem(item)).map((item) => {
                    return (<Item key={item.id} item={item} database={db} />)
                  })}
                </div>
              </>
              <>
                <div className={styles.sublistTitle}>Déjà réservés par le Père Noël</div>
                <div className={styles.list}>
                  {giftedItems.length === 0
                    ? <div>Rien pour le moment</div>
                    : giftedItems.filter((item) => filterItem(item)).map((item) => {
                      return (<Item key={item.id} item={item} database={db} />)
                    })}
                </div>
              </>

            </>
          }
        </div>
        <div className={styles.footer}>Site créé par L&B</div>
      </main>
    </div>
  )
}
