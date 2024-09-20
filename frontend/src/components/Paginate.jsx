import {Pagination} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';


const Paginate = ({pages, page, isAdmin = false, keyword = ''}) => {
    const location = useLocation();
    const isuserList = location.pathname.includes('/admin/userlist');
  return (
    pages > 1 && (
        <Pagination>
            {[...Array(pages).keys()].map((x) => (
                <LinkContainer
                    key={x + 1}
                    to={
                        !isAdmin ? keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}` : isuserList ? `/admin/userlist/${x + 1}` : `/admin/productlist/${x + 1}`
                    }>
                        <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                </LinkContainer>
            ))}
        </Pagination>
    )
  )
}

export default Paginate;