exports.generateLink = (req, res, next) => {
	User.findOne({ where: { email: req.body.email } })
		.then((current_user) => {
			if (current_user) {
				if (current_user.password === null) {
					//google signed in user - reset password is not possible
					res
						.status(401)
						.send({ message: "Incorrect Email Id or Email Id doesnot exists" });
				} else {
					//generating link to send a mail.
					new_salt = uuid();
					const link =
						environment[process.env.NODE_ENV].url +
						"/user/forgotPasswordGetLink?u=" +
						QuickEncrypt.encrypt(current_user.email, publicKey) +
						"&id=" +
						QuickEncrypt.encrypt(new_salt, publicKey);

					current_user
						.update({
							forgotPasswordSalt: new_salt // to check during password reset
						})
						.then(() => {
							req.link = link;
							setTimeout(() => {
								current_user.update({ forgotPasswordSalt: null }).then(() => {
									console.log("Link expired");
								});
							}, 2 * 60 * 1000); //Time in milli-seconds
							console.log("link : " + link);
							next(); //Sending Mail
						});
				}
			} else {
				res
					.status(401)
					.send({ message: "Incorrect Email Id/Email Id doesnot exists" });
			}
		})
		.catch((err) => {
			res.status(400).send({ message: "Server error", err: err});
		});
};

exports.getLink = (req, res, next) => {
	try {
		const email = QuickEncrypt.decrypt(req.query.u, privateKey);
		User.findOne({
			where: { email: email }
		})
			.then((User) => {
				if (User) {
					if (
						QuickEncrypt.decrypt(req.query.id, privateKey) ===
						User.forgotPasswordSalt
					) {
						const link =
							environment[process.env.NODE_ENV].url + "/user/resetPassword";

						//This response only for dev purpose..
						res.send(
							"<html><body><form action =" +
								link +
								" method=\"POST\"><input type='text' name = 'password'/><input type='hidden' name = 'id' value = " +
								req.query.id +
								"></input><input type='hidden' name = 'email' value = " +
								req.query.u +
								"></input><input type = 'submit'/></form></body></html>"
						);
					} else {
						res.status(401).send({ message: "Bad request" });
					}
				} else {
					res.status(401).send({ message: "User not found" });
				}
			})
			.catch((err) => {
				res.status(400).send({ message: "Link expired" });
			});
	} catch {
		res.status(401).send({ message: "Invalid Link" });
	}
};

exports.resetPassword = (req, res, next) => {
	try {
		const email = QuickEncrypt.decrypt(req.body.email, privateKey);
		const forgotPasswordSalt = QuickEncrypt.decrypt(req.body.id, privateKey);
		User.findOne({ where: { email: email } })
			.then((User) => {
				if (User) {
					if (forgotPasswordSalt === User.forgotPasswordSalt) {
						new_salt = uuid();
						new_hashed_password = crypto
							.createHash(process.env.hash_algo, new_salt)
							.update(req.body.password)
							.digest("hex");
						User.update({
							forgotPasswordSalt: null, //link is active for one time updation only
							hashed_password: new_hashed_password,
							salt: new_salt
						}).then(() => {
							res.status(200).send({ message: "Password updated" });
						});
					} else {
						res.status(401).send({ message: "Bad Request" });
					}
				} else {
					res.status(401).send({ message: "User not found" });
				}
			})
			.catch((err) => {
				res.status(400).send({ message: "Server error" });
			});
	} catch {
		res.status(401).send({ message: "Restricted Access" });
	}
};