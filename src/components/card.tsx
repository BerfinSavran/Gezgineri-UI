function Card(props: any){
    return (
        <div className="card mt-5">
            <div className="card-body">
              <h3 className="card-title text-center">{props.title}</h3>
              {props.children}
            </div>
        </div>
    )
}
export default Card;