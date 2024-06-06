"use client";

import { getAccessTokenFromLocalStoreage } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu", // authRequired: undefined nghĩa lúc nào cũng hiển thị
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, // Khi false nghĩa là chưa đăng nhập thì mới hiển thị
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, // Khi true nghĩa là đăng nhập mới hiển thị
  },
];

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false);

  // Không nên check thay đổi isAuth trong qua trinh render (trong phần render HTML)
  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStoreage()));
  }, []);

  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
