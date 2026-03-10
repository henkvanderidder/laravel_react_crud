import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Auth, type User, type PaginationProps} from '@/types';
import { Head, Link, router, usePage, useForm} from '@inertiajs/react';
import { Alert, AlertTitle, AlertDescription} from '@/components/ui/alert';
import * as React from "react";
import {Eye, Pencil, Trash, CirclePlusIcon, X} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Pagination } from '@/components/ui/pagination';
//import { create, show, edit, destroy } from "@/actions/App/Http/Controllers/ProductController";
import productsController from "@/actions/App/Http/Controllers/ProductController";
import { Input } from '@headlessui/react';

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
    featured_image_original_name: string;
    created_at: string;
}

interface ProductPagination extends PaginationProps {
  data: Product[];
}
interface FilterProps {
  search: string;
  perPage: string;
}

interface IndexProps {
  productsPage: ProductPagination;
  auth: Auth;
  filters: FilterProps;
}

//export const Dashboard = () => {
//export default function Index({...props} : { products: Product[] }) {
export default function Index({ ...props}: IndexProps ) {

       //const { products } = props;
    console.log('Props:', props);

    const  { auth, productsPage, filters} = props;

    console.log('auth.email',auth.user.email);
    const products = productsPage.data;

    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [ showAlert, setShowAlert ] = useState(flash?.success || flash?.error ? true : false);
    //const [ showAlert, setShowAlert ] = useState( false);

    useEffect(() => {
      if (flashMessage) {
        const timer = setTimeout ( () => setShowAlert(false), 3000);
        return () => clearTimeout(timer);
      }
    }, [flashMessage]);

    console.log('Flash messages:', flashMessage);

    // Handle Delete
    const handleDelete = (id: number) => {
        if (confirm('Are you sure, you want to delete?')) {
          //destroy(id);
          //setShowAlert(true);
          router.delete(productsController.destroy(id), {
              preserveState: true,
              preserveScroll: true,
          });
        }
    };

    const {data, setData} = useForm({
      search: filters.search || '',
      perPage: filters.perPage ||'5',
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setData('search', value);

      const queryString = {
        ...(value && { search: value}),
        ...(data.perPage && { perPage: data.perPage}),
      }

      //const queryString = value ? {search: value} : {};

      router.get(productsController.index(), queryString , {
        preserveState: true,
        preserveScroll: true,
      })
    }

    const handleSearchReset = () => {
      
      setData('search', '');

      const queryString = {
        ...(data.perPage && { perPage: data.perPage}),
      }

      router.get(productsController.index(), queryString , {
        preserveState: true,
        preserveScroll: true,
      })
    }

    const handlePerPageChange = (value:string) => {
      console.log("changed per page: ", value);
      setData('perPage', value);
      
      const queryString = {
        ...(data.search && { search: data.search}),
        ...(value && { perPage: value}),
      }

      router.get(productsController.index(), queryString , {
        preserveState: true,
        preserveScroll: true,
      })
    }


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

              <div className = 'flex items-center justify-between gap-4'>
                {/* Search box */}
                <Input
                    type='text'
                    value={data.search}
                    onChange={handleSearch}
                    placeholder='Zoek product...'
                    name='search'
                    className='h-10 w-1/3 border rounded'
                />
                <Button 
                  onClick={handleSearchReset}
                  className='h-10 cursor-prointer bg-red-600 hover:bg-red-500'>
                  <X size={20}/>
                </Button>

                <div className="ml-auto">
                  
                  {/* Add button */}

                  <Link className="flex items-center mb-4 rounded-lg bg-blue-600 px-4 py-2 text-white text-md cursor-pointer hover:opacity-90"
                        as='button' 
                        href={productsController.create()}
                  >
                  <CirclePlusIcon className="mr-2 h-4 w-4" /> Voeg nieuw product toe
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <table className="w-full table-auto">
                  <thead>
                    <tr className='bg-black/10'>
                      <th className="border border-gray-300 px-4 py-2">#</th>
                      <th className="border border-gray-300 px-4 py-2">Naam</th>
                      <th className="border border-gray-300 px-4 py-2">Omschrijving</th>
                      <th className="border border-gray-300 px-4 py-2">Prijs</th>
                      <th className="border border-gray-300 px-4 py-2">Afbeelding</th>
                      <th className="border border-gray-300 px-4 py-2">Aanmaakdatum</th>
                      <th className="border border-gray-300 px-4 py-2">Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render product rows here */}
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-2 text-center border">Geen producten gevonden.</td>
                      </tr>
                    ) : (
                      products.map((product, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className='px-4 py-2 text-center border'>{productsPage.from + index}</td>
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
                            href={productsController.show(product.id)}
                            className='ms-2 cursor-pointer bg-green-600 text-white p-2 rounded-lg hover:opacity-90'
                          >
                            <Eye size={16} />{' '}
                          </Link>
                          <Link 
                            as='button'
                            href={productsController.edit(product.id)}
                            className='ms-2 cursor-pointer bg-blue-600 text-white p-2 rounded-lg hover:opacity-90'
                          >
                            <Pencil size={16} />{' '}
                          </Link>
                          <Button 
                            
                            onClick={() => {
                              // handleDelete(product.id, destroy(product.id));
                              handleDelete(product.id);
                            }}
                            className='h-8 w-9 ms-2 cursor-pointer bg-red-600 text-white p-2 rounded-lg hover:opacity-90'
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
              {/* Pagination */}
              <Pagination 
                page={productsPage} 
                perPage={data.perPage}
                onPerPageChange={handlePerPageChange}
              />
            </div>
        </AppLayout>
    );
}
