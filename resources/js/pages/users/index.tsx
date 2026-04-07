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
import usersController from "@/actions/App/Http/Controllers/UserController";
import { Input } from '@headlessui/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: '/users',
    },
];

interface UserPagination extends PaginationProps {
  data: User[];
}

interface FilterProps {
  search: string;
  perPage: string;
}

interface IndexProps {
  usersPage: UserPagination;
  auth: Auth;
  filters: FilterProps;
}


export default function Index({ ...props}: IndexProps ) {

       //const { products } = props;
    console.log('Props:', props);

    const  { auth, usersPage, filters} = props;

    const loginUser = auth.user as User;

    //console.log('auth.email',auth.user.email);
    console.log('loginUser.name',loginUser.name);

    const users = usersPage.data;

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
          router.delete(usersController.destroy(id), {
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

      router.get(usersController.index(), queryString , {
        preserveState: true,
        preserveScroll: true,
      })
    }

    const handleSearchReset = () => {
      
      setData('search', '');

      const queryString = {
        ...(data.perPage && { perPage: data.perPage}),
      }

      router.get(usersController.index(), queryString , {
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

      router.get(usersController.index(), queryString , {
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
                    placeholder='Zoek gebruiker...'
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
                        href={usersController.create()}
                  >
                  <CirclePlusIcon className="mr-2 h-4 w-4" /> Voeg nieuwe gebruiker toe
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <table className="w-full table-auto">
                  <thead>
                    <tr className='bg-black/10'>
                      <th className="border border-gray-300 px-4 py-2">#</th>
                      <th className="border border-gray-300 px-4 py-2">Naam</th>
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <th className="border border-gray-300 px-4 py-2">Avatar</th>
                      <th className="border border-gray-300 px-4 py-2">Aanmaakdatum</th>
                      <th className="border border-gray-300 px-4 py-2">Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Render user rows here */}
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-2 text-center border">Geen gebruikers gevonden.</td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className='px-4 py-2 text-center border'>{usersPage.from + index}</td>
                        <td className='px-4 py-2 text-center border'>{user.name}</td>
                        <td className='px-4 py-2 text-center border'>{user.email}</td>
                        <td className='px-4 py-2 text-center border'>
                          {user.avatar && (
                            <img src={user.avatar} alt={user.name} className="w-16 h-16 object-cover mx-auto" />
                          )}
                        </td>
                        <td className='px-4 py-2 text-center border'>{user.created_at}</td>
                        <td className='px-4 py-2 text-center border'>
                          <Link 
                            as='button'
                            href={usersController.show(user.id)}
                            className='ms-2 cursor-pointer bg-green-600 text-white p-2 rounded-lg hover:opacity-90'
                          >
                            <Eye size={16} />{' '}
                          </Link>
                          <Link 
                            as='button'
                            href={usersController.edit(user.id)}
                            className='ms-2 cursor-pointer bg-blue-600 text-white p-2 rounded-lg hover:opacity-90'
                          >
                            <Pencil size={16} />{' '}
                          </Link>
                          <Button 
                            
                            onClick={() => {
                              // handleDelete(user.id, destroy(user.id));
                              handleDelete(user.id);
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
                page={usersPage} 
                perPage={data.perPage}
                onPerPageChange={handlePerPageChange}
              />
            </div>
        </AppLayout>
    );
}
