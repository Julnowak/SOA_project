import React, {useEffect} from "react";

const Products = () => {

    useEffect(
        () => {
          ( async () => {
              const response = await fetch('http://localhost:8000/api/products/', {
                });

              const data = await response.json();

              console.log(data)
          }
          )();

        }, []);

    return (
        <div>
            <h2>Products</h2>
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                  </tr>
                </thead>

                <tbody>
                <tr>
                  <td>1,001</td>
                  <td>Lorem</td>
                  <td>ipsum</td>
                  <td>dolor</td>
                  <td>sit</td>
                </tr>
                </tbody>

              </table>
            </div>
        </div>
    );
};

export default Products;