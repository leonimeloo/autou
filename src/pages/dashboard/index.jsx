import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

import styles from '@/styles/Dashboard.module.scss';
import Link from 'next/link';

import moment from 'moment';
import 'moment/locale/pt-br';

import json from '@/assets/data.json';

export default function Dashboard() {
    const [ data, setData ] = useState([]);
    const [ ratings, setRatings ] = useState([]);
    const [ clientRate, setClientRate ] = useState('lucas.fernandes@cliente.com');
    const [ reacts, setReacts] = useState('');
    const [ content, setContent ] = useState('');
    const router = useRouter();

    useEffect(() => {
        if(window.localStorage.getItem('client')) {
            setData(JSON.parse(window.localStorage.getItem('client')));
            fetchRatings();
        } else {
            router.push('/');
        }
    }, []);

    const fetchRatings = async() => {
        const response = await axios.get('/api/avaliacoes');
        setRatings(response.data);
    }

    const LogOut = () => {
        window.localStorage.removeItem('client');
        router.push('/');
    }

    const deleteRating = async(id) => {
        const response = await axios.delete('/api/excluir', {
            data: {
                id: id
            }
        });

        if(response.status == 201) {
            fetchRatings();
        }
    }

    const reactionButton = (reaction) => {
        switch(reaction) {
            case 'like':
                setReacts('Like');
            break;
            case 'orgulho':
                setReacts('Orgulho');
            break;
            case 'trabalho':
                setReacts('Excelente Trabalho');
            break;
            case 'colaboracao':
                setReacts('Colaboração');
            break;
        }

        document.getElementById(reaction).style.backgroundColor = '#bb7f25';
        document.getElementById(reaction).style.borderColor = '#bb7f25';

        const react = [ 'like', 'orgulho', 'trabalho', 'colaboracao' ];

        react.map(r => {
            if(r != reaction) {
                document.getElementById(r).style.backgroundColor = '#0c4a91';
                document.getElementById(r).style.borderColor = '#0c4a91';
            }
        });
    }

    const doRating = async() => {
        if(content != '' && reacts != '' && clientRate != '') {

            const cl = json.filter(r => r.email == clientRate);

            const ctt = await axios.post('/api/avaliar', {
                owner: {
                    nome: `${data.nome} ${data.sobrenome}`,
                    email: data.email,
                    matricula: data.matricula,
                    cargo: data.cargo,
                    foto: data.foto
                },
                destination: {
                    nome: `${cl[0].nome} ${cl[0].sobrenome}`,
                    email: cl[0].email,
                    matricula: cl[0].matricula,
                    cargo: cl[0].cargo
                },
                content: content,
                like: reacts
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(ctt.status == 201) {
                fetchRatings();
                router.push('/dashboard#allratings');
            }
        } else {
            alert('Dados imcompletos!')
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.cards}>
                <div className={styles.profile}>
                    <div className={styles.profileCard}>
                        <div className={styles.information}>
                            <img src={data.foto} alt="Employer Logo" />
                            <div>
                                <p>{`${data.nome} ${data.sobrenome}`}</p>
                                <p>Matrícula: {`${data.matricula}`}</p>
                                <p>{`${data.email}`}</p>
                                <p>Cargo: {`${data.cargo}`}</p>
                            </div>
                        </div>
                        <div className={styles.profileInfo}>
                            <p>{ratings.filter((r) => r.destination.email == `${data.email}`).length}</p>
                            <span>avaliações recebidas</span>
                            <Link href="/dashboard#myratings">
                                Ver avaliações {`>`}
                            </Link>
                        </div>
                        <button className={styles.logout} onClick={LogOut}>SAIR DO PERFIL</button>
                    </div>
                    <div className={styles.rate}>
                        <p>Que tal fazer uma avaliação sobre outros colaboradores?</p>
                        <div className={styles.ratingBtns}>
                        <span>Escolha um colaborador: </span>
                        <select value={clientRate} onChange={(e) => setClientRate(e.target.value)}>
                        {
                            json.map((client, index) => {
                                return (
                                    <option key={index} value={client.email}>
                                       {`${client.nome} ${client.sobrenome}`} 
                                    </option>
                                )
                            })
                        }
                        </select>
                        </div>
                        <input type="text" placeholder="No que você está pensando?" value={content} onChange={txt => setContent(txt.target.value)}/>
                        <div className={styles.ratingBtns}>
                            <span>Escolha uma reação:</span>
                            <button id='like' onClick={() => reactionButton('like')}>👍<br/> LIKE</button>
                            <button id='orgulho' onClick={() => reactionButton('orgulho')}>🤩<br/> ORGULHO</button>
                            <button id='trabalho' onClick={() => reactionButton('trabalho')}>💼<br/> EXCELENTE TRABALHO</button>
                            <button id='colaboracao' onClick={() => reactionButton('colaboracao')}>👥<br/> COLABORAÇÃO</button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center'}}>
                            <button className={styles.submit} onClick={doRating}>ENVIAR AVALIAÇÃO</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.allratings} id='myratings'>
                <h4>Avaliações recebidas:</h4>
                {
                    ratings.map((rating, index) => {
                        if(rating.destination.email == data.email) {
                            return (
                                <>
                                    <div className={styles.rating} key={index}>
                                        <div className={styles.owner}>
                                            <img src={rating.owner.foto} />
                                            <div>
                                                <p>{`${rating.owner.nome}`}</p>
                                                <span>fez uma avaliação de {rating.like} para {rating.destination.nome}</span>
                                            </div>
                                        </div>
                                        <div className={styles.content}>
                                            <h6>{rating.content}</h6>
                                        </div>
                                        {
                                            rating.owner.email == data.email ? 
                                            <div className={styles.config}>
                                                <span>{moment(rating.createdAt).locale('pt-br').fromNow()} ▪</span>
                                                <button onClick={() => {
                                                    deleteRating(rating._id)
                                                }}>EXCLUIR</button>
                                            </div>
                                            : null
                                        }
                                    </div>
                                </>
                            )
                        }
                    })
                }
            </div>

            <div className={styles.allratings} id='allratings'>
                <h4>Todas as avaliações:</h4>
                {
                    ratings.map((rating, index) => {
                        return (
                            <>
                                <div className={styles.rating} key={index}>
                                    <div className={styles.owner}>
                                        <img src={rating.owner.foto} />
                                        <div>
                                            <p>{`${rating.owner.nome}`}</p>
                                            <span>fez uma avaliação de {rating.like} para {rating.destination.nome}</span>
                                        </div>
                                    </div>
                                    <div className={styles.content}>
                                        <h6>{rating.content}</h6>
                                    </div>
                                    {
                                        rating.owner.email == data.email ? 
                                        <div className={styles.config}>
                                            <span>{moment(rating.createdAt).locale('pt-br').fromNow()} ▪</span>
                                            <button onClick={() => {
                                                deleteRating(rating._id)
                                            }}>EXCLUIR</button>
                                        </div>
                                        : 
                                        <div className={styles.config}>
                                            <span>{moment(rating.createdAt).locale('pt-br').fromNow()}</span>
                                        </div>
                                    }
                                </div>
                            </>
                        )
                    })
                }
            </div>
        </main>
    )
}