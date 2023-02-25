import style from './Spinner.module.css'
import { ReactComponent as Spin } from '@/assets/images/Spinner.svg';

export default function Spinner() {
    return (
		<div className={style['container']}>
        	<Spin className={style['spin']}/>
    	</div>
    )
}
