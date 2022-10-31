import { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import {
	AiOutlineLike,
	AiFillLike,
	AiFillDislike,
	AiOutlineDislike,
} from 'react-icons/ai';
import { Comment } from '../../types/appTypes';

const CommentRow = ({ comment }: { comment: Comment }) => {
	const [liked, setLiked] = useState(false);
	const [disliked, setDisliked] = useState(false);

	const isLiked = (liked: boolean) => {
		return liked ? (
			<AiFillLike className="fs-5" />
		) : (
			<AiOutlineLike className="fs-5" />
		);
	};
	const isDisLiked = (disliked: boolean) => {
		return disliked ? (
			<AiFillDislike className="fs-5" style={{ transform: 'scale(-1, 1)' }} />
		) : (
			<AiOutlineDislike
				className="fs-5"
				style={{ transform: 'scale(-1, 1)' }}
			/>
		);
	};
	return (
		<>
			<Container className="mb-4 p-0" fluid>
				<Row>
					<Container className="d-flex">
						<div className="avatar-big">
							<img
								src="/user-test-img.jpg"
								className="avatar-img rounded-circle"
							/>
						</div>
						<Container className="ms-0">
							<div>
								<p className="mb-0">
									<strong>{comment.userName}</strong>{' '}
									<span className="text-muted">{comment.date}</span>
								</p>
							</div>
							<div>
								<p className="mb-0">{comment.comment}</p>
								<Container className="mt-0 px-0" fluid>
									<button
										className="like-button"
										onClick={() => setLiked(!liked)}
									>
										{isLiked(liked)}
									</button>
									<button
										className="like-button "
										onClick={() => setDisliked(!disliked)}
									>
										{isDisLiked(disliked)}
									</button>
								</Container>
							</div>
						</Container>
					</Container>
				</Row>
			</Container>
		</>
	);
};

export default CommentRow;