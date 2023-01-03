import logo from "@ecotoken/ui/assets/brand/logo.png";
import Navbar from "@/components/layout/navbar";
import Sidebar, {
	SidebarItem,
	SidebarItemProps,
	SidebarCategoryProps,
	SidebarCategory
} from "@/components/layout/sidebar";
import {
	faArrowLeft,
	faGear,
	faUser,
	faHouse,
	faImage,
	faLeaf,
	faGlobe,
	faWallet
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

const sidebarCategories: Readonly<SidebarCategoryProps>[] = [
	{
		name: "Admin",
		icon: faUser,
		items: [
			{
				path: "/admin-users",
				name: "Admin Users",
				icon: faUser
			},
			{
				path: "/websites",
				name: "Websites",
				icon: faGlobe
			},
			{
				path: "/configuration",
				name: "Configuration",
				icon: faImage
			}
		]
	}
];

const sidebarItems: SidebarItemProps[] = [
	{
		path: "/",
		name: "Dashboard",
		icon: faHouse
	},
	{
		path: "/administration",
		name: "Administration",
		icon: faWallet
	},
	{
		path: "/users",
		name: "Users",
		icon: faUser
	},
	{
		path: "/settings",
		name: "Settings",
		icon: faGear
	},
	{
		path: "/projects",
		name: "ecoProjects",
		icon: faLeaf
	}
];

const DefaultLayout: NextPage<React.PropsWithChildren> = ({ children }) => {
	const [expanded, setExpanded] = useState(true);

	const { data: lastSiteID } = trpc.websites.getCurrentSite.useQuery();
	const { mutateAsync: updateCurrentSite } =
		trpc.websites.updateCurrent.useMutation();
	const { data: currentSiteData } = trpc.websites.get.useQuery(
		{ siteID: lastSiteID! },
		{ enabled: !!lastSiteID }
	);

	const { data: siteData } = trpc.websites.getAll.useInfiniteQuery(
		{},
		{
			getNextPageParam: (info) => info.nextCursor
		}
	);

	const router = useRouter();

	return (
		<>
			{
				<Head>
					<title>EcoToken</title>
					<meta name="description" content="The EcoToken system." />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1"
					/>
					<link rel="icon" href="/favicon.ico" />
				</Head>
			}

			<div id="grid">
				<Sidebar
					id="sidebar"
					expanded={expanded}
					className="border-r border-slate-300"
				>
					<div className="flex space-x-2">
						<div className="ml-0.5 flex h-[60px] w-[60px] items-center justify-center">
							<Image
								src={logo}
								alt="ecoToken System"
								className="w-10"
							/>
						</div>
						<div className="flex items-center">
							<div className="flex items-center rounded-lg bg-slate-300 px-4 py-2">
								<select
									name="Current site"
									className="appearance-none bg-transparent text-center"
									onChange={async (e) =>
										await updateCurrentSite({
											siteID: e.target.value
										})
									}
								>
									{siteData?.pages[0]?.websites.map(
										(website, index) => (
											<option
												value={website.siteID}
												key={index}
											>
												{website.siteName}
											</option>
										)
									)}
								</select>
							</div>
						</div>
					</div>
					{sidebarCategories.map(
						({ name, items, icon }, categoryIndex) => (
							<SidebarCategory
								name={name}
								icon={icon}
								expanded={expanded}
								key={categoryIndex}
							>
								{items?.map(
									({ name, path, icon }, itemIndex) => (
										<SidebarItem
											key={itemIndex}
											path={path}
											name={name}
											icon={icon}
											expanded={expanded}
										/>
									)
								)}
							</SidebarCategory>
						)
					)}
					{sidebarItems.map(({ name, path, icon }, index) => (
						<SidebarItem
							key={index}
							path={path}
							name={name}
							icon={icon}
							expanded={expanded}
						/>
					))}
					<SidebarItem
						name="Collapse Sidebar"
						icon={() => (
							<FontAwesomeIcon
								icon={faArrowLeft}
								className={`ease-out ${
									!expanded && "-rotate-180"
								}`}
							/>
						)}
						expanded={expanded}
						onClick={() => setExpanded(!expanded)}
						className={clsx(
							"-mt-2.5 opacity-0 delay-75 duration-200 hover:opacity-100 focus:opacity-100"
						)}
					/>
				</Sidebar>

				<Navbar className="flex h-full w-full border-b border-slate-300 bg-slate-200 px-4" />
				<main
					id="main"
					className="m-0 flex h-full w-full items-start justify-start overflow-x-auto overflow-y-auto bg-slate-200 p-8"
				>
					{children}
				</main>
			</div>
		</>
	);
};

export default DefaultLayout;
