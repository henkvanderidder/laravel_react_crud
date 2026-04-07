import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm} from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import {ArrowLeft, LoaderCircle} from 'lucide-react';
import * as React from "react";
//import { create, show, edit, destroy } from "@/actions/App/Http/Controllers/UserController";
//import userController  from "@/actions/App/Http/Controllers/UserController";
import userRoutes from "@/routes/users";

//export const Dashboard = () => {
export default function UserForm({...props}) {

    console.log('UserForm props:', props);
    const { user, isView, isEdit } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'Show' : isEdit ? 'Update' : 'Create'} User`,
            href: userRoutes.create.url(),
        },
    ];

    // voor post, zie de uitleg op https://inertiajs.com/docs/v2/the-basics/forms
    const { data, setData, post, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        avatar: null as File | null,
        _method: isEdit ? 'PUT' : 'POST',
    });

    // Form submission handler
    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitForm data:', data);

        if (isEdit) {
            //post(route('users.update', user.id), {
            post(userRoutes.update.url(user.id), {
                forceFormData: true,
                onSuccess: () => {
                  console.log('update errors:', errors);
                  reset();
                },
            });
        } else {
            //post(route('users.store'), {
            post(userRoutes.store.url(), {
                onSuccess: () => {
                  console.log('store errors:', errors);
                  reset();
                },
            });
        }
    }

    // File Upload handling
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        if (e.target.files && e.target.files.length > 0) {
            setData('avatar', e.target.files[0]);
        } 
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
              <div className="ml-auto">
                <Link 
                  as='button'
                  href={userRoutes.index.url()} 
                  className="flex items-center w-fit mb-4 rounded-lg bg-blue-600 px-4 py-2 text-white text-md cursor-pointer hover:opacity-90"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Terug
                </Link>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>{ isView ? 'Show' : isEdit ? 'Update' : 'Create new'} User</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* User form fields go here */}
                  <form 
                    className="flex flex-col gap-4" 
                    autoComplete='off'
                    onSubmit={e => {submitForm(e)}}
                  >
                    <div className='grid gap-6'>
                      {/* User Name Field */}
                      <div className="grid gap-2">
                        <Label htmlFor="name">User Name</Label>
                        <Input 
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            type="text" 
                            id="name" 
                            name="name" 
                            placeholder="Enter user name" 
                            autoFocus
                            tabIndex={1}
                            disabled={isView || processing}
                        />
                        <InputError message={errors.name} />
                      </div>
                      {/* User Email Field */}
                      <div className="grid gap-2">
                        <Label htmlFor="email">User Email</Label>
                        <Input 
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            type="text" 
                            id="email" 
                            name="email" 
                            placeholder="Enter user email" 
                            autoFocus
                            tabIndex={2}
                            disabled={isView || processing}
                        />
                        <InputError message={errors.email} />
                      </div>
                      {/* User Avatar Field */}
                      {!isView && ( 
                      <div className="grid gap-2">
                        <Label htmlFor="avatar">Avatar</Label>
                        <Input 
                            onChange={handleFileUpload}                            
                            type="file" 
                            id="avatar" 
                            name="avatar" 
                            autoFocus
                            tabIndex={3}
                        />
                        <InputError message={errors.avatar} />
                      </div>
                      )}
                      {(isView || isEdit) && (
                      <div className="grid gap-2">
                        <Label htmlFor="avatar">Current Avatar Image</Label>
                        {user?.avatar ? (
                          <img src={user.avatar} 
                              alt="Avatar image" 
                              className="w-50 h-40 border rounded-lg" 
                          />
                        ) : (
                          <p>No avatar image available</p>
                        )}
                      </div>
                      )}

                      {/* Submit Button */}
                      {!isView && (
                        <Button
                          type="submit"
                          className="mt-4 w-fit cursor-pointer"
                          tabIndex={5}
                          disabled={processing}
                        >
                          {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                          {processing 
                            ? (isEdit ? 'Updating... ' : 'Creating...') 
                            : (isEdit ? 'Update' : 'Create') }
                            Gebruiker
                          
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
        </AppLayout>
    );
}
