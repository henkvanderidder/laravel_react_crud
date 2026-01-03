import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage} from '@inertiajs/react';
import { Alert, AlertTitle, AlertDescription} from '@/components/ui/alert';
import * as React from "react";
import {Eye, Pencil, Trash, CirclePlusIcon} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Products',
        href: '/products',
    },
];

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    featured_image: string;
    created_at: string;
}

//export const Dashboard = () => {
//export default function Index({...props} : { products: Product[] }) {
export default function Index({...props}) {

    const products: Product[] = props.products;
    //const { products } = props;
    console.log('products:', products);

    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [ showAlert, setShowAlert ] = useState(flashMessage ? true : false);

    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout ( () => setShowAlert(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage]);

    console.log('Flash messages:', flash);

        // Handle Delete
    const handleDelete = (id: number, route: string) => {
        if (confirm('Are you sure, you want to delete?')) {
            router.delete(route, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
              {showAlert && flashMessage && (
                <Alert variant={'default'} 
                  className={`${flash?.success ? 'border-green-500 bg-green-50 text-green-700' : flash?.error ? 'border-red-500 bg-red-50 text-red-700' : '' } ml-auto mb-4 w-fit`}>
                  <AlertTitle>{flash?.success ? 'Success' : 'Error'}</AlertTitle>
                  <AlertDescription>
                    {flash?.success || flash?.error}
                  </AlertDescription>
              </Alert>
              )} 
              <div className="ml-auto">
                <Link className="flex items-center mb-4 rounded-lg bg-blue-600 px-4 py-2 text-white text-md cursor-pointer hover:opacity-90"
                      as='button' 
                      href={route('products.create')}
                >
                 <CirclePlusIcon className="mr-2 h-4 w-4" /> Add New Product
                </Link>
              </div>
              <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <table className="w-full table-auto">
                  <thead>
                    <tr className='bg-black/10'>
                      <th className="border border-gray-300 px-4 py-2">#</th>
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">Description</th>
                      <th className="border border-gray-300 px-4 py-2">Price</th>
                      <th className="border border-gray-300 px-4 py-2">Featured Image</th>
                      <th className="border border-gray-300 px-4 py-2">Created Date</th>
                      <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render product rows here */}
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-2 text-center border">No products found.</td>
                      </tr>
                    ) : (
                      products.map((product, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className='px-4 py-2 text-center border'>{index + 1}</td>
                        <td className='px-4 py-2 text-center border'>{product.name}</td>
                        <td className='px-4 py-2 text-center border'>{product.description}</td>
                        <td className='px-4 py-2 text-center border'>€{product.price}</td>
                        <td className='px-4 py-2 text-center border'>
                          {product.featured_image && (
                            <img src={product.featured_image} alt={product.name} className="w-16 h-16 object-cover mx-auto" />
                          )}
                        </td>
                        <td className='px-4 py-2 text-center border'>{product.created_at}</td>
                        <td className='px-4 py-2 text-center border'>
                          <Link 
                            as='button'
                            href={route('products.show', product.id)}
                            className='ms-2 cursor-pointer bg-green-600 text-white p-2 rounded-lg hover:opacity-90'
                          >
                            <Eye size={16} />{' '}
                          </Link>
                          <Link 
                            as='button'
                            href={route('products.edit', product.id)}
                            className='ms-2 cursor-pointer bg-blue-600 text-white p-2 rounded-lg hover:opacity-90'
                          >
                            <Pencil size={16} />{' '}
                          </Link>
                          <Button 
                            
                            onClick={() => {
                              handleDelete(product.id, route('products.destroy', product.id));
                            }}
                            className='ms-2 cursor-pointer bg-red-600 text-white p-2 rounded-lg hover:opacity-90'
                          >
                            <Trash size={16} />{' '}
                          </Button>
                        </td>
                      </tr>
                      ))
                    )}

                  </tbody>
                </table>  
              </div>
            </div>
        </AppLayout>
    );
}
