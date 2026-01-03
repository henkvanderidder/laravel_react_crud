import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm} from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CustomTextarea } from '@/components/ui/custom-textarea';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import {ArrowLeft, LoaderCircle} from 'lucide-react';
import * as React from "react";


//export const Dashboard = () => {
export default function ProductForm({...props}) {

    console.log('ProductForm props:', props);
    const { product, isView, isEdit } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'Show' : isEdit ? 'Update' : 'Create'} Product`,
            href: route('products.create'),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        featured_image: null as File | null,
        _method: isEdit ? 'PUT' : 'POST',
    });

    // Form submission handler
    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form data:', data);

        if (isEdit) {
            post(route('products.update', product.id), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route('products.store'), {
                onSuccess: () => reset(),
            });
        }
    }

    // File Upload handling
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        if (e.target.files && e.target.files.length > 0) {
            setData('featured_image', e.target.files[0]);
        } 
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
              <div className="ml-auto">
                <Link 
                  as='button'
                  href={route('products.index')} 
                  className="flex items-center w-fit mb-4 rounded-lg bg-blue-600 px-4 py-2 text-white text-md cursor-pointer hover:opacity-90"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                </Link>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>{ isView ? 'Show' : isEdit ? 'Update' : 'Create new'} Product</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Product form fields go here */}
                  <form 
                    className="flex flex-col gap-4" 
                    autoComplete='off'
                    onSubmit={e => {submitForm(e)}}
                  >
                    <div className='grid gap-6'>
                      {/* Product Name Field */}
                      <div className="grid gap-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input 
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            type="text" 
                            id="name" 
                            name="name" 
                            placeholder="Enter product name" 
                            autoFocus
                            tabIndex={1}
                            disabled={isView || processing}
                        />
                        <InputError message={errors.name} />
                      </div>
                      {/* Product Description Field */}
                      <div className="grid gap-2">
                        <Label htmlFor="description">Product Description</Label>
                        <CustomTextarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)} 
                            id="description" 
                            name="description" 
                            placeholder="Enter product description" 
                            autoFocus
                            tabIndex={2}
                            rows={4}
                            disabled={isView || processing}
                        />
                        <InputError message={errors.description} />
                      </div>
                      {/* Product Price Field */}
                      <div className="grid gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input 
                            value={data.price}
                            onChange={e => setData('price', e.target.value)}
                            type="text" 
                            id="price" 
                            name="price" 
                            placeholder="Enter product price" 
                            autoFocus
                            tabIndex={3}
                            disabled={isView || processing}
                        />
                        <InputError message={errors.price} />
                      </div>
                      {/* Product Featured image Field */}
                      {!isView && ( 
                      <div className="grid gap-2">
                        <Label htmlFor="featured_image">Featured Image</Label>
                        <Input 
                            onChange={handleFileUpload}                            
                            type="file" 
                            id="featured_image" 
                            name="featured_image" 
                            autoFocus
                            tabIndex={4}
                        />
                        <InputError message={errors.featured_image} />
                      </div>
                      )}
                      {(isView || isEdit) && (
                      <div className="grid gap-2">
                        <Label htmlFor="featured_image">Current Featured Image</Label>
                        {product?.featured_image ? (
                          <img src={product.featured_image} 
                              alt="Featured image" 
                              className="w-50 h-40 border rounded-lg" 
                          />
                        ) : (
                          <p>No featured image available</p>
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
                            Product
                          
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
