import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { productUpdateByAdmin, ProductsDetails} from '../actions/productActions'
import { PRODUCT_DETAILS_RESET, PRODUCT_UPDATE_RESET ,} from '../constants/productConstants'
import axios from 'axios'

const ProductEditScreen = ({ match, history }) => {
    const productId = match.params.id

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails
  
    const productUpdate = useSelector((state) => state.productUpdate)
  const { loading:loadingUpdate, error:errorUpdate, success:successUpdate } = productUpdate



  useEffect(() => {
    if (successUpdate) {
      dispatch({ type:PRODUCT_UPDATE_RESET })
      dispatch({ type:PRODUCT_DETAILS_RESET })
      history.push('/admin/productlist')
    } else {
        if (!product) {
            dispatch(ProductsDetails(productId))
        } else if ( product._id !== productId) { 
            dispatch(ProductsDetails(productId))
        }else{
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, history, productId, product, successUpdate])
   
    const uploadFileHandler = async (e) => {
        console.log('data loading')
        const file = e.target.files[0]
        console.log(file)
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type':'multipart/form-data'
                }
            }
            if (formData) {
                const { data } = await axios.post('/api/upload', formData, config)
                console.log(data)
               
                setImage(data)
                setUploading(false)
                
            } else {
                console.log('Form Data is null')
            }
        } catch (error) {
            console.error(error)
            setUploading(false)
        }
    }

    
  const submitHandler = (e) => {
     e.preventDefault()
     dispatch( productUpdateByAdmin ({ _id: productId, name, price, image,brand,category,description,countInStock }))
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='Name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='Price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='Image'>
               <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='Image'>
               <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
                 ></Form.Control>
                <Form.File label='Choose File' custom onChange={uploadFileHandler}></Form.File>
                {uploading && <Loader/>}
            </Form.Group>

            <Form.Group controlId='Image'>
               <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='Image'>
               <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
                              
            <Form.Group controlId='Image'>
               <Form.Label>CountInStock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter CountInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
