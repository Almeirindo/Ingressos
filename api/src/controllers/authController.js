const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const crypto = require('crypto');
const prisma = require('../prismaClient');

exports.register = async (req, res) => {
  try {
    let { name, email, phone, password } = req.body;

    // Trim all inputs
    name = name ? name.trim() : '';
    email = email ? email.trim() : '';
    password = password ? password.trim() : '';
    phone = phone ? phone.trim() : '';

    // Validações básicas
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Nome, email, telefone e senha são obrigatórios.' });
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de email inválido.' });
    }

    // Email to lowercase
    email = email.toLowerCase();

    // Verificar se email contém maiúsculas (after trim and lower)
    if (email !== email.toLowerCase()) {
      return res.status(400).json({ error: 'Email não pode conter letras maiúsculas.' });
    }

    // Validate phone: full numeric string (countryCode + local)
    let cleanPhone = phone.replace(/\D/g, '');
    // If 9 digits and starts with 9, assume Angola mobile and prepend 244
    if (cleanPhone.length === 9 && cleanPhone.startsWith('9')) {
      cleanPhone = '244' + cleanPhone;
    }
    if (cleanPhone.length < 12 || isNaN(parseInt(cleanPhone))) {
      return res.status(400).json({ error: 'Telefone inválido. Use o formato completo com código do país.' });
    }

    const countryCode = cleanPhone.slice(0, 3);
    const localDigits = cleanPhone.slice(3);
    let expectedLocalLength;

    if (countryCode === '244' || countryCode === '351') {
      expectedLocalLength = 9;
    } else if (countryCode === '55') {
      expectedLocalLength = 11;
    } else {
      return res.status(400).json({ error: 'Código de país não suportado. Use +244 (Angola), +351 (Portugal) ou +55 (Brasil).' });
    }

    if (localDigits.length !== expectedLocalLength || isNaN(parseInt(localDigits))) {
      return res.status(400).json({
        error: `Telefone local deve ter ${expectedLocalLength} dígitos para ${countryCode === '244' ? 'Angola' : countryCode === '351' ? 'Portugal' : 'Brasil'}.`
      });
    }

    const phoneBigInt = BigInt(cleanPhone);

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone: phoneBigInt }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe com este email ou telefone.' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phoneBigInt,
        password: hashedPassword,
        role: 'USER',
        isActive: true
      }
    });

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone.toString(), // Convert BigInt to string for JSON
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.login = async (req, res) => {
  try {
    let { phone, email, password } = req.body;

    // Trim inputs
    password = password ? password.trim() : '';
    email = email ? email.trim() : '';
    phone = phone ? phone.trim() : '';

    if ((!phone && !email) || !password) {
      return res.status(400).json({ error: 'Telefone ou email e senha são obrigatórios.' });
    }

    // Normalize phone if provided: full numeric (country + local)
    let cleanPhoneStr = null;
    if (phone) {
      cleanPhoneStr = phone.replace(/\D/g, '');
      // If 9 digits and starts with 9, assume Angola mobile and prepend 244
      if (cleanPhoneStr.length === 9 && cleanPhoneStr.startsWith('9')) {
        cleanPhoneStr = '244' + cleanPhoneStr;
      }
      if (cleanPhoneStr.length < 12 || isNaN(parseInt(cleanPhoneStr))) {
        return res.status(400).json({ error: 'Telefone deve estar no formato completo com código do país (ex: 244912345678).' });
      }

      const countryCode = cleanPhoneStr.slice(0, 3);
      const localDigits = cleanPhoneStr.slice(3);
      let expectedLocalLength;

      if (countryCode === '244' || countryCode === '351') {
        expectedLocalLength = 9;
      } else if (countryCode === '55') {
        expectedLocalLength = 11;
      } else {
        return res.status(400).json({ error: 'Código de país não suportado no login.' });
      }

      if (localDigits.length !== expectedLocalLength) {
        return res.status(400).json({ error: `Telefone inválido para login. Verifique o formato.` });
      }
    }

    // Email to lowercase if provided
    const lowerEmail = email ? email.toLowerCase() : '';

    // Buscar usuário por telefone ou email
    let orConditions = [];
    if (cleanPhoneStr) {
      const phoneBigInt = BigInt(cleanPhoneStr);
      orConditions.push({ phone: phoneBigInt });
    }
    if (lowerEmail) {
      orConditions.push({ email: lowerEmail });
    }

    const user = await prisma.user.findFirst({
      where: {
        AND: [
          { isActive: true },
          { OR: orConditions }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais incorretas.' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais incorretas.' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone.toString(), // Convert BigInt to string
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone.toString(), // Convert BigInt to string
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email ou telefone é obrigatório.' });
    }

    let user;
    if (email) {
      user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    } else {
      let cleanPhone = phone.replace(/\D/g, '');
      // If 9 digits and starts with 9, assume Angola mobile and prepend 244
      if (cleanPhone.length === 9 && cleanPhone.startsWith('9')) {
        cleanPhone = '244' + cleanPhone;
      }
      if (cleanPhone.length < 12 || isNaN(parseInt(cleanPhone))) {
        return res.status(400).json({ error: 'Telefone deve estar no formato completo com código do país.' });
      }

      const countryCode = cleanPhone.slice(0, 3);
      const localDigits = cleanPhone.slice(3);
      let expectedLocalLength;

      if (countryCode === '244' || countryCode === '351') {
        expectedLocalLength = 9;
      } else if (countryCode === '55') {
        expectedLocalLength = 11;
      } else {
        return res.status(400).json({ error: 'Código de país não suportado.' });
      }

      if (localDigits.length !== expectedLocalLength) {
        return res.status(400).json({ error: 'Formato de telefone inválido.' });
      }

      const phoneBigInt = BigInt(cleanPhone);
      user = await prisma.user.findUnique({ where: { phone: phoneBigInt } });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetExpires }
    });

    // Send reset code via email or SMS
    if (email) {
      // Send via email
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`Código de recuperação para ${user.email}: ${resetToken}`);
        return res.json({ message: 'Código de recuperação gerado. Verifique o console do servidor.' });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Recuperação de Senha',
        text: `Seu código de recuperação de senha é: ${resetToken}\n\nEste código expira em 1 hora.`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar email:', error);
          return res.status(500).json({ error: 'Erro ao enviar email de recuperação.' });
        }
        res.json({ message: 'Código de recuperação enviado para o email.' });
      });
    } else {
      // Send via SMS
      if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        console.log(`Código de recuperação para telefone ${user.phone}: ${resetToken}`);
        return res.json({ message: 'Código de recuperação gerado. Verifique o console do servidor.' });
      }

      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

      // Extract country and local from stored phone BigInt
      const phoneStr = user.phone.toString();
      const countryCode = phoneStr.slice(0, 3);
      const local = phoneStr.slice(3);
      const toPhone = `+${countryCode}${local}`;

      client.messages.create({
        body: `Seu código de recuperação de senha é: ${resetToken}. Expira em 1 hora.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: toPhone
      })
      .then(message => {
        res.json({ message: 'Código de recuperação enviado para o telefone.' });
      })
      .catch(error => {
        console.error('Erro ao enviar SMS:', error);
        res.status(500).json({ error: 'Erro ao enviar SMS de recuperação.' });
      });
    }

  } catch (error) {
    console.error('Erro no forgot password:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetExpires: null }
    });

    res.json({ message: 'Senha alterada com sucesso.' });

  } catch (error) {
    console.error('Erro no reset password:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
