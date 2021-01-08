const handleRegister = (req, res, db, bcrypt) => {
    
    const { name, email, password } = req.body;

    // bcrypt.hash( password, null, null, function(err, hash) {
         // console.log(hash);
    // });

    /*
    database.users.push(
        {
            id: '125',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
        }
    );
    */

    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }

    const hash = bcrypt.hashSync( password );

    db.transaction(trx => {
        trx.insert({
            hash:hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {

            return trx('users')
            .returning('*') //return all the columns
            .insert({
                name:name,
                email:loginEmail[0], //because we are returning an array
                joined: new Date()
            })
            .then( user => {
                 res.json(user[0]);
            })
        })
        .then(trx.commit) // if all transaction pass then commit transaction
        .catch(trx.rollback)
    })

    //.catch(err => res.status(400).json(err));
    .catch(err => res.status(400).json("unable to register"));
   
    // res.json(database.users[database.users.length - 1]);
}

module.exports = {
    handleRegister: handleRegister
};