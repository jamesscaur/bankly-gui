import Head from 'next/head'
import styles from '../styles/Home.module.css'
import handler from './api/[action]'

// Modified from https://chainz.cryptoid.info/
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let htmlArray = [];
    json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        let cls = styles.number;
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = styles.key;
            } else {
                cls = styles.string;
            }
        } else if (/true|false/.test(match)) {
            cls = styles.boolean;
        } else if (/null/.test(match)) {
            cls = styles.null;
        }
        htmlArray.push([cls, match])
        if (cls !== styles.key) htmlArray.push(false)
    });
    return htmlArray.map(item => {
        return !item ? <br></br> : <span className={item[0]}>{item[1]}</span>
    })
}

export default function Home({ data }) {
    return (
        <div className={styles.container}>
            <Head>
                <title>Bankly GUI</title>
                <meta name="description" content="Interface for Bankly" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <picture className="logo-desk"><a href="/"><svg xmlns="http://www.w3.org/2000/svg" width="122" height="48.469"><g transform="translate(-340.498 -264.672)"><g transform="translate(340.498 264.672)"><path d="M351.622 270.9c5.815 0 9.922 4.177 9.922 10.046S357.436 291 351.622 291a8.769 8.769 0 01-5.7-2.021l-.613 1.4H340.5v-25.7h6.431v7.521a8.855 8.855 0 014.693-1.3zm3.357 10.046a4.228 4.228 0 10-4.227 4.287 4.152 4.152 0 004.227-4.284z" transform="translate(-340.498 -264.672)"></path><path d="M510.611 305.688v18.885h-5.029l-.557-1.335a8.944 8.944 0 01-5.7 1.974c-5.775 0-9.9-4.213-9.9-10.082a9.583 9.583 0 019.9-10.012 8.96 8.96 0 015.77 2.029l.665-1.46zm-6.187 9.457a4.228 4.228 0 10-4.227 4.307 4.149 4.149 0 004.227-4.306z" transform="translate(-466.483 -298.889)"></path><path d="M672.236 313.246v11.515h-6.5v-10.616c0-2.2-.826-3.288-2.463-3.288-2.029 0-3.2 1.417-3.2 3.821v10.085h-6.5v-18.886h4.564l.894 1.947a7.851 7.851 0 015.945-2.506c4.38 0 7.26 3.117 7.26 7.928z" transform="translate(-605.343 -299.057)"></path><path d="M813.065 290.377l-4.73-7.986v7.986h-6.5v-25.7h6.5v14.213l4.5-7.4h7.3l-5.885 9 6.481 9.884z" transform="translate(-730.767 -264.672)"></path><path d="M935.533 264.672h6.505v25.7h-6.505z" transform="translate(-843.874 -264.672)"></path><path d="M1012.783 308.945l-7.916 18.044c-2.545 5.78-4.885 7.868-9.762 7.868h-2.228v-5.589h1.789c2.489 0 3.239-.648 4.12-3l-7.8-17.325h7.069l4.008 10.4 3.735-10.4z" transform="translate(-890.783 -302.125)"></path></g><g transform="translate(388.62 297.411)"><path fill="#0076f4" d="M681.3 492.937h-6.767v-1.078a2.811 2.811 0 00-2.815-2.859h-12a6.809 6.809 0 01-6.819-6.819v-4.971h6.6v3.969h11.751a6.929 6.929 0 016.685 4.153 6.965 6.965 0 016.693-4.257H696.5v-3.865h6.547v4.971a6.8 6.8 0 01-6.765 6.819h-12.123a2.822 2.822 0 00-2.863 2.863z" transform="translate(-652.897 -477.206)"></path></g></g></svg></a></picture>

                <p className={styles.description}>
                    <pre className={styles.pre}>{syntaxHighlight(JSON.stringify(data))}</pre>
                </p>

                <div className={styles.grid}>
                    <a href="/currentBalance" className={styles.card}>
                        <h2>Current Balance &rarr;</h2>
                    </a>

                    <a href="/latestStatement" className={styles.card}>
                        <h2>Latest Statement (20) &rarr;</h2>
                    </a>

                    <a href="/recentEvents" className={styles.card}>
                        <h2>Recent Events (20) &rarr;</h2>
                    </a>

                    <a href="/generatePix" className={styles.card}>
                        <h2>Generate Pix (R$500) &rarr;</h2>
                    </a>
                </div>
            </main>
        </div>
    )
}

export async function getServerSideProps(context) {
    if (!!context.query.action) {
        const data = await handler(context);
        if (!data) {
            return {
                notFound: true,
            }
        }
        return {
            props: { data: data.data },
        }
    } else {
        return {
            props: {
                data: "Not Found"
            }
        }
    }
}