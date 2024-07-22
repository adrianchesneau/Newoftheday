import { useDispatch } from 'react-redux';
import { addBookmark, removeBookmark, removeAllBookmark } from '../reducers/bookmarks';
import Image from 'next/image';
import styles from '../styles/Article.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';


function Article(props) {

	const canBookmark = useSelector((state) => state.user.value.token);

	const dispatch = useDispatch();

	const handleBookmarkClick = () => {
		if (canBookmark) {
			if (props.isBookmarked) {
				dispatch(removeBookmark(props));
			} else {
				dispatch(addBookmark(props));
			}
		}
	}



	let iconStyle = {};
	if (props.isBookmarked) {
		iconStyle = { 'color': '#E9BE59' };
	}

	return (
		<div className={styles.articles}>
			<div className={styles.articleHeader}>
				<h3>{props.title}</h3>
				<FontAwesomeIcon icon={faBookmark} onClick={() => handleBookmarkClick()} style={iconStyle} className={styles.bookmarkIcon} />
			</div>
			<h4 style={{ textAlign: "right" }}>- {props.author}</h4>
			<div className={styles.divider}></div>
			<Image src={props.urlToImage} alt={props.title} width={600} height={314} />
			<p>{props.description}</p>
		</div>
	);
}

export default Article;
