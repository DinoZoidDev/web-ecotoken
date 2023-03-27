/*
 * Copyright (C) 2023 EcoToken Systems
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Country, State } from "country-state-city";
import { toast } from "react-hot-toast";
import { createEcoLocationSchema } from "@ecotoken/api/src/schema/location";
import Button from "@ecotoken/ui/components/Button";
import { CardDescription, CardTitle } from "@ecotoken/ui/components/Card";
import Form, {
    FormInput,
    FormSelect,
    useZodForm,
} from "@ecotoken/ui/components/Form";

export const CreateEcoLocation: React.FC = () => {
    const router = useRouter();
    const context = trpc.useContext();

    const { mutateAsync, isLoading } = trpc.ecoLocations.create.useMutation({
        onSuccess: async (data) => {
            await context.ecoLocations.getAll.invalidate();
            await router.push(
                `/eco-projects/locations/${data.locationID}/edit`,
            );
            toast.success("Location has been created.");
        },
        onError(e) {
            toast.error(e.message);
        },
    });

    const { data: activeSiteID, isLoading: fetchingSite } =
        trpc.websites.getCurrentSite.useQuery();

    const form = useZodForm({
        schema: createEcoLocationSchema.omit({
            siteID: true,
        }),
        reValidateMode: "onChange",
        defaultValues: {
            cn: undefined,
            location: undefined,
            st: undefined,
        },
    });

    const country = form.watch("cn");

    return (
        <Transition
            as={Fragment}
            show
            appear
            enter="ease-out duration-500"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-500"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
        >
            <div className="space-y-4">
                <div className="flex space-x-2">
                    <Link
                        href="/eco-projects/locations"
                        className="inline-block"
                    >
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            size="lg"
                            className="mt-1.5 text-slate-400"
                        />
                    </Link>
                    <div>
                        <CardTitle>Create Location</CardTitle>
                        <CardDescription>
                            Create a location for ecoProjects.
                        </CardDescription>
                    </div>
                </div>
                <Form
                    form={form}
                    className={clsx("flex w-full flex-col gap-4")}
                    onSubmit={async (location) => {
                        if (activeSiteID)
                            await mutateAsync({
                                ...location,
                                siteID: activeSiteID,
                            });
                    }}
                >
                    <FormInput
                        label="Location"
                        size="full"
                        {...form.register("location")}
                    />
                    <FormSelect
                        label="Country"
                        size="full"
                        defaultValue=""
                        {...form.register("cn")}
                    >
                        <option value="" hidden></option>
                        {Country.getAllCountries().map((country) => (
                            <option
                                key={country.isoCode}
                                value={country.isoCode}
                            >
                                {country.name}
                            </option>
                        ))}
                    </FormSelect>
                    <FormSelect
                        label="State/Province"
                        size="full"
                        defaultValue=""
                        {...form.register("st")}
                    >
                        <option value="" hidden></option>
                        {country &&
                            State.getStatesOfCountry(country).map((country) => (
                                <option
                                    key={country.isoCode}
                                    value={country.isoCode}
                                >
                                    {country.name}
                                </option>
                            ))}
                    </FormSelect>
                    <Button loading={isLoading || fetchingSite} fullWidth>
                        Create
                    </Button>
                </Form>
            </div>
        </Transition>
    );
};

export default CreateEcoLocation;
