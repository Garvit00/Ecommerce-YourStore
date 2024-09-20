import React from 'react'
import {LinkContainer} from 'react-router-bootstrap';
import {Table, Button} from 'react-bootstrap';
import {FaCheck, FaTimes, FaEdit, FaTrash} from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Paginate from '../../components/Paginate';
import {toast} from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {useGetUsersQuery, useDeleteUserMutation} from '../../slices/usersApiSlice';

const UserListScreen = () => {

    const {pageNumber} = useParams();

    const {data, refetch, isLoading, error} =  useGetUsersQuery({pageNumber});
    const [deleteUser, {isLoading: loadingdelete}] = useDeleteUserMutation();

    const deleteHandler = async (id) => {
        if(window.confirm('Are you sure to delete a user?')){
            try {
                await deleteUser(id);
                toast.success('User Deleted');
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }   
        }
    }

  return (
    <>
    <h1>Users</h1>
    {loadingdelete && <Loader/>}
    {isLoading ? (<Loader/>) : error ? (<Message variant='danger'>{error}</Message>) : (
      <>
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <td>ID</td>
              <td>NAME</td>
              <td>EMAIL</td>
              <td>ADMIN</td>
              <td></td>
              </tr>
            </thead>
          <tbody>
            {data.users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{<a href={`mailto:${user.email}`}>{user.email}</a>}</td>
                <td>{user.isAdmin ? (
                      <FaCheck style={{ color: 'green' }} />
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}</td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                        <Button className='btn-sm' variant='light'><FaEdit/></Button>
                    </LinkContainer>
                    <Button className='btn-sm' variant='light' onClick={() => deleteHandler(user._id)}>
                      <FaTrash style={{color: 'grey'}}/>
                        </Button>
                  </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginate pages={data.pages} page={data.page} isAdmin={true} />
      </>
    )}
    
    </>
  )
}

export default UserListScreen;