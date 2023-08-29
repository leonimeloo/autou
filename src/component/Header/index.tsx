import React from "react";

import styles from './styles.module.scss';
import Link from "next/link";

import moment from "moment";
import 'moment/locale/pt-br';

export default function Header() {

    return (
        <header className={styles.header}>
            <Link href="/">
                <img src="/images/logo.png" alt="Logo Image" />
                <h1>Reactions</h1>
            </Link>
            <p>{moment().format('ddd, DD MMMM')}</p>
        </header>
    )
}