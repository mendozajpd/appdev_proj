<x-mail::message>
# Email Verification

Dear User,

Thank you for registering with {{ config('app.name') }}. Please verify your email address to activate your account.

Click the following link to verify your email:
<a href="{{ $verificationUrl }}">Verify Email</a>

If you did not create an account with {{ config('app.name') }}, no further action is required.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>