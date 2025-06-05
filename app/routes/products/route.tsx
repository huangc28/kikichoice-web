import { Outlet } from '@remix-run/react';

export default function Products() {
  return (
    <div>
      hello product
      <Outlet />
    </div>
  );
}
